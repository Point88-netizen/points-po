#!/usr/bin/env node
/**
 * Fabrique une version autonome de l'application : un seul fichier HTML qui
 * s'ouvre par double-clic, sans serveur et sans accès réseau.
 *
 * Trois choses partent :
 *   1. le lien vers design/build/tokens.css → le CSS est recopié dans le fichier ;
 *   2. les liens vers les polices Google → sans réseau ils échouent en silence,
 *      autant assumer les polices du système, qui sont déclarées en repli
 *      partout dans la feuille de style ;
 *   3. les liens du panneau latéral vers d'autres fichiers du dépôt, qui
 *      n'existent pas à côté d'un fichier isolé.
 *
 * Usage :  node design/autonome.mjs [sortie]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, "..");
const sortie = process.argv[2] ?? join(racine, "points-po-app.html");

let html = readFileSync(join(racine, "app", "index.html"), "utf8");
const tokens = readFileSync(join(ici, "build", "tokens.css"), "utf8");

const avant = html.length;

/* 1 · les tokens, recopiés à la place de leur lien */
const lienTokens = '<link rel="stylesheet" href="../design/build/tokens.css">';
if (!html.includes(lienTokens)) throw new Error("Le lien vers tokens.css a changé de forme.");
html = html.replace(
  lienTokens,
  "<style>\n/* ── design/build/tokens.css, recopié : ce fichier doit tenir seul ── */\n" +
    tokens.trimEnd() + "\n</style>"
);

/* 2 · les polices distantes */
const polices = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
];
for (const l of polices) {
  if (!html.includes(l)) throw new Error("Un lien de préconnexion a changé de forme.");
  html = html.replace(l + "\n", "");
}
const lienPolices = html.match(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\n/);
if (!lienPolices) throw new Error("Le lien vers les polices a changé de forme.");
html = html.replace(
  lienPolices[0],
  "<!-- Polices du système : les piles de repli (Georgia, système, monospace)\n" +
    "     sont déclarées dans la feuille de style. Pour retrouver Fraunces,\n" +
    "     Manrope et DM Mono, remettre ici le lien Google Fonts. -->\n"
);

/* 3 · les liens vers le reste du dépôt */
const bloc = html.match(/ *<div class="n-l">[\s\S]*?<\/div>\n/);
if (!bloc) throw new Error("Le bloc de liens du panneau a changé de forme.");
html = html.replace(bloc[0], "");

/* Aucun appel au réseau ne doit subsister. */
const restes = [...html.matchAll(/(?:https?:)?\/\/[^\s"'<>)]+/g)]
  .map((m) => m[0])
  .filter((u) => !u.startsWith("//127.0.0.1") && !u.includes("www.w3.org"));
if (restes.length) {
  console.error("Références distantes encore présentes :");
  for (const r of [...new Set(restes)]) console.error("  " + r);
  process.exit(1);
}

writeFileSync(sortie, html);
const ko = (n) => (n / 1024).toFixed(0) + " Ko";
console.log(`${sortie}`);
console.log(`  ${ko(html.length)} — un seul fichier, aucune requête réseau`);
console.log(`  (source ${ko(avant)} + tokens ${ko(tokens.length)})`);
