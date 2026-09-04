#!/usr/bin/env node
/**
 * Camins — chaîne de tokens, sans dépendance.
 *
 * Lit les fichiers DTCG de tokens/, résout les alias {chemin.vers.token},
 * et produit build/tokens.css et build/tokens.ts.
 *
 * En production on remplace ce fichier par Style Dictionary v4 (voir
 * style-dictionary.config.mjs) : le format d'entrée est le même, seul le
 * générateur change. Ce script existe pour que la chaîne tourne aujourd'hui,
 * sans installation.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const DOSSIER = join(ici, "tokens");
const SORTIE = join(ici, "build");

/* ── lecture ── */
const arbre = {};
for (const f of readdirSync(DOSSIER).filter(f => f.endsWith(".json"))) {
  Object.assign(arbre, JSON.parse(readFileSync(join(DOSSIER, f), "utf8")));
}

/* ── aplatissement : hérite de $type le long du chemin ── */
const tokens = [];
(function parcourir(noeud, chemin, typeHerite) {
  const type = noeud.$type ?? typeHerite;
  if (noeud.$value !== undefined) {
    tokens.push({ chemin, type, valeur: noeud.$value, desc: noeud.$description, ext: noeud.$extensions });
    return;
  }
  for (const [cle, enfant] of Object.entries(noeud)) {
    if (cle.startsWith("$") || typeof enfant !== "object" || enfant === null) continue;
    parcourir(enfant, [...chemin, cle], type);
  }
})(arbre, [], undefined);

const parChemin = new Map(tokens.map(t => [t.chemin.join("."), t]));

/* ── résolution des alias ── */
function resoudre(valeur, vus = new Set()) {
  if (typeof valeur !== "string") return valeur;
  const m = valeur.match(/^\{([^}]+)\}$/);
  if (!m) return valeur;
  if (vus.has(m[1])) throw new Error("Alias circulaire : " + m[1]);
  const cible = parChemin.get(m[1]);
  if (!cible) throw new Error("Alias introuvable : " + valeur);
  return resoudre(cible.valeur, new Set([...vus, m[1]]));
}

/* ── rendu CSS par type ── */
function css(t) {
  const v = resoudre(t.valeur);
  switch (t.type) {
    case "color":       return v;
    case "duration":    return v.value + (v.unit ?? "ms");
    case "dimension":   return v.value + (v.unit ?? "px");
    case "cubicBezier": return `cubic-bezier(${v.join(", ")})`;
    case "fontFamily":  return v.map(f => (/\s/.test(f) ? `'${f}'` : f)).join(", ");
    case "number":      return String(v);
    default:            return String(v);
  }
}
const nom = t => "--" + t.chemin.join("-").toLowerCase();

/* ── écriture ── */
mkdirSync(SORTIE, { recursive: true });

const jour = tokens.filter(t => !t.chemin[0].endsWith("-nuit"));
const nuit = tokens.filter(t => t.chemin[0].endsWith("-nuit"));

const ligne = t =>
  (t.desc ? `  /* ${t.desc} */\n` : "") + `  ${nom(t)}: ${css(t)};`;

const feuille = `/* Généré par design/construire.mjs — ne pas modifier à la main.
   Source : design/tokens/*.json (format DTCG). */

:root {
${jour.map(ligne).join("\n")}
}

/* Déclinaison nuit — ne redéfinit que les rôles, jamais le socle. */
:root[data-theme="nuit"] {
${nuit.map(t => `  --role-${t.chemin.slice(1).join("-").toLowerCase()}: ${css(t)};`).join("\n")}
}
`;
writeFileSync(join(SORTIE, "tokens.css"), feuille);

const ts = `/* Généré par design/construire.mjs — ne pas modifier à la main. */
export const tokens = {
${tokens.map(t => `  ${JSON.stringify(t.chemin.join("."))}: ${JSON.stringify(css(t))},`).join("\n")}
} as const;

export type NomDeToken = keyof typeof tokens;

/** Récupère un token. Passer par ici, jamais par une valeur littérale. */
export const jeton = (n: NomDeToken) => tokens[n];
`;
writeFileSync(join(SORTIE, "tokens.ts"), ts);

console.log(`${tokens.length} tokens → build/tokens.css, build/tokens.ts`);
