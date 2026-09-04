#!/usr/bin/env node
/**
 * Camins — vérificateur statique des règles d'attention (document 03).
 *
 * Une règle écrite dans un document est une intention.
 * Une règle vérifiée par un script est une contrainte.
 *
 * Usage :  node design/verifier-tokens.mjs [dossier...]
 * Sortie :  code 1 si une règle bloquante est violée.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, "..");
const cibles = process.argv.slice(2).map(p => join(racine, p));
if (!cibles.length) cibles.push(join(racine, "app"));

/* ══ tokens ══ */
const arbre = {};
for (const f of readdirSync(join(ici, "tokens")).filter(f => f.endsWith(".json")))
  Object.assign(arbre, JSON.parse(readFileSync(join(ici, "tokens", f), "utf8")));

const plat = new Map();
(function parcourir(n, chemin, type) {
  const t = n.$type ?? type;
  if (n.$value !== undefined) { plat.set(chemin.join("."), { valeur: n.$value, type: t, ext: n.$extensions }); return; }
  for (const [k, v] of Object.entries(n))
    if (!k.startsWith("$") && v && typeof v === "object") parcourir(v, [...chemin, k], t);
})(arbre, []);

const val = c => {
  const t = plat.get(c);
  if (!t) throw new Error("Token inconnu : " + c);
  const m = typeof t.valeur === "string" && t.valeur.match(/^\{([^}]+)\}$/);
  return m ? val(m[1]) : t.valeur;
};

/* ══ contraste WCAG ══ */
const canal = c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(hex) {
  const [r, g, b] = hex.replace("#", "").match(/../g).map(h => parseInt(h, 16) / 255);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
const contraste = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* ══ règles ══ */
const PAIRES = [
  ["role.texte.principal",  "role.fond.page",  7.0, "Texte principal sur la page"],
  ["role.texte.principal",  "role.fond.carte", 7.0, "Texte principal sur une carte"],
  ["role.texte.secondaire", "role.fond.page",  4.5, "Texte secondaire"],
  ["role.texte.tertiaire",  "role.fond.page",  4.5, "Texte tertiaire"],
  ["role.etat-acquis",      "role.fond.page",  4.5, "État acquis"],
  ["role.securite",         "role.fond.page",  4.5, "Message de sécurité"],
  ["socle.papier.blanc",    "role.action-principale", 4.5, "Libellé sur l'action principale"],
  ["role-nuit.texte.principal", "role-nuit.fond.page", 7.0, "Texte principal — nuit"],
  ["role-nuit.attention-deverrouillage", "role-nuit.fond.page", 4.5, "Déverrouillage — nuit"]
];

const DUREES_AUTORISEES = new Set(
  [...plat.entries()].filter(([c]) => c.startsWith("duree.")).map(([, t]) => t.valeur.value)
);
const JAUNES = [val("socle.jaune"), val("socle.nuit.jaune")].map(h => h.toUpperCase());
const AUTORISES_JAUNE = (plat.get("role.attention-deverrouillage").ext?.["camins.fichiers-autorises"] ?? [])
  .map(p => new RegExp("^" + p.replace(/\*/g, ".*") + "$"));

/* ══ collecte des fichiers ══ */
const fichiers = [];
(function marcher(p) {
  if (!statSync(p, { throwIfNoEntry: false })) return;
  if (statSync(p).isDirectory()) { for (const e of readdirSync(p)) if (e !== "build" && e !== "node_modules") marcher(join(p, e)); return; }
  if ([".html", ".js", ".mjs", ".ts", ".tsx", ".css"].includes(extname(p))) fichiers.push(p);
})(cibles[0]);
for (const c of cibles.slice(1)) (function m(p) {
  if (statSync(p).isDirectory()) { for (const e of readdirSync(p)) m(join(p, e)); return; }
  fichiers.push(p);
})(c);

/* ══ exécution ══ */
let bloquantes = 0, avertissements = 0;
const bloc = (titre) => console.log("\n\x1b[1m" + titre + "\x1b[0m");
const ko = (m) => { console.log("  \x1b[31m✕\x1b[0m " + m); bloquantes++; };
const at = (m) => { console.log("  \x1b[33m!\x1b[0m " + m); avertissements++; };
const ok = (m) => console.log("  \x1b[32m✓\x1b[0m " + m);

bloc("1 · Contraste — chaque rôle contre son fond");
for (const [a, b, seuil, libelle] of PAIRES) {
  const r = contraste(val(a), val(b));
  const msg = `${libelle} — ${r.toFixed(2)}:1 (exigé ${seuil}:1)`;
  r >= seuil ? ok(msg) : ko(msg);
}

bloc("2 · Durées — seuls les six rythmes sont autorisés");
const RE_DUREE = /(?:transition[^;:]*:|animation[^;:]*:)[^;]*?(\d+(?:\.\d+)?)(ms|s)\b|(?:setTimeout|setInterval)\s*\([^,]+,\s*(\d+)/g;
let horsToken = [];
for (const f of fichiers) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(RE_DUREE)) {
    const ms = m[3] ? +m[3] : m[2] === "s" ? +m[1] * 1000 : +m[1];
    if (ms === 0) continue;
    if (!DUREES_AUTORISEES.has(ms)) horsToken.push({ f: relative(racine, f), ms });
  }
}
if (horsToken.length) {
  const parValeur = [...horsToken.reduce((m, x) => m.set(x.ms, (m.get(x.ms) ?? 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1]).slice(0, 8);
  at(`${horsToken.length} durées littérales hors token — les plus fréquentes : ` +
     parValeur.map(([v, n]) => `${v}ms ×${n}`).join(", "));
  at(`Rythmes autorisés : ${[...DUREES_AUTORISEES].sort((a, b) => a - b).join(", ")} ms`);
} else ok("Aucune durée littérale");

bloc("3 · Le jaune — réservé à l'instant de déverrouillage");
let jauneHorsZone = [];
for (const f of fichiers) {
  const rel = relative(racine, f);
  if (AUTORISES_JAUNE.some(re => re.test(rel))) continue;
  const src = readFileSync(f, "utf8").toUpperCase();
  for (const j of JAUNES) {
    const n = src.split(j).length - 1;
    if (n) jauneHorsZone.push({ rel, j, n });
  }
}
if (jauneHorsZone.length) {
  for (const { rel, j, n } of jauneHorsZone) at(`${j} apparaît ${n}× dans ${rel} — hors zone autorisée`);
  at(`Zone autorisée : ${AUTORISES_JAUNE.length ? plat.get("role.attention-deverrouillage").ext["camins.fichiers-autorises"].join(", ") : "aucune"}`);
} else ok("Le jaune ne sort pas de sa zone");

bloc("4 · Quotas déclarés");
ok(`Notifications : ${val("quota.notifications-par-semaine")}/semaine · sons : ${val("quota.sons-par-sortie")}/sortie · clignotements : ${val("quota.clignotements-dans-l-app")} · accents : ${val("quota.accents-par-ecran")}/écran`);
ok(`Budget hebdomadaire déclaré : ${Math.round(val("budget.total-hebdo").value / 60000)} min`);

console.log(`\n${fichiers.length} fichiers analysés — \x1b[31m${bloquantes} bloquantes\x1b[0m, \x1b[33m${avertissements} avertissements\x1b[0m\n`);
process.exit(bloquantes ? 1 : 0);
