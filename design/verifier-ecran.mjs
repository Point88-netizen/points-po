#!/usr/bin/env node
/**
 * Camins — vérificateur d'écran rendu.
 *
 * Le vérificateur statique lit le code ; celui-ci lit le résultat.
 * Il ouvre une page dans un vrai navigateur et applique quatre des
 * protocoles du document 03 (§10) à ce qui s'affiche réellement.
 *
 * Usage :  node design/verifier-ecran.mjs <url> [largeur] [hauteur] [parcours]
 *
 * « parcours » est une suite de sélecteurs séparés par des virgules,
 * cliqués l'un après l'autre. Sans lui, seul l'écran d'accueil est mesuré —
 * et un défaut logé dans une fiche fermée passe inaperçu. Les résultats de
 * chaque étape sont fusionnés.
 * Requiert Playwright (déjà présent sur les runners CI usuels).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ici = dirname(fileURLToPath(import.meta.url));
const require_ = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require_("playwright")); }
catch { ({ chromium } = require_("/opt/node22/lib/node_modules/playwright")); }

const url = process.argv[2];
if (!url) { console.error("Usage : node design/verifier-ecran.mjs <url>"); process.exit(2); }
const largeur = +(process.argv[3] ?? 390), hauteur = +(process.argv[4] ?? 844);
const parcours = (process.argv[5] ?? "").split(",").map(x => x.trim()).filter(Boolean);

/* ── seuils, lus dans les tokens ── */
const arbre = {};
for (const f of readdirSync(join(ici, "tokens")).filter(f => f.endsWith(".json")))
  Object.assign(arbre, JSON.parse(readFileSync(join(ici, "tokens", f), "utf8")));
const CIBLE_MIN = arbre.cible.minimum.$value.value;           // 48
const CIBLE_ANNO = arbre.cible.annotation.$value.value;       // 30, exemption déclarée
const ACCENTS_MAX = arbre.quota["accents-par-ecran"].$value; // 1
const CLIGNOTEMENTS_MAX = arbre.quota["clignotements-dans-l-app"].$value; // 1

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: largeur, height: hauteur }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);

const mesurer = () => p.evaluate(({ CIBLE_MIN, CIBLE_ANNO }) => {
  const visible = el => {
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > .05;
  };
  const nomme = el =>
    (el.textContent || "").trim().slice(0, 34).replace(/\s+/g, " ") ||
    el.getAttribute("aria-label") || el.className || el.tagName;

  /* 1 · cibles tactiles */
  const interactifs = [...document.querySelectorAll('button, a[href], input, select, [role="button"], [onclick]')].filter(visible);
  /* Les annotations de carte relèvent d'un seuil déclaré à part (30 px) :
     elles se touchent à l'arrêt. Elles restent vérifiées, contre ce seuil. */
  const mesure = el => {
    const r = el.getBoundingClientRect();
    const anno = el.dataset.cible === "annotation";
    return { nom: nomme(el), l: Math.round(r.width), h: Math.round(r.height), anno,
             seuil: anno ? CIBLE_ANNO : CIBLE_MIN };
  };
  const toutes = interactifs.map(mesure);
  const petites = toutes.filter(c => !c.anno && (c.l < c.seuil || c.h < c.seuil));
  const petitesAnno = toutes.filter(c => c.anno && (c.l < c.seuil || c.h < c.seuil));
  const nbAnno = toutes.filter(c => c.anno).length;

  /* 2 · éléments qui bougent en boucle */
  const anim = [...document.querySelectorAll("*")].filter(el => {
    if (!visible(el)) return false;
    const s = getComputedStyle(el);
    return s.animationName !== "none" && (s.animationIterationCount === "infinite" || +s.animationIterationCount > 3);
  }).map(el => ({ nom: nomme(el), animation: getComputedStyle(el).animationName }));

  /* 3 · contraste réellement rendu */
  const canal = c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = rgb => { const [r, g, bl] = rgb.map(v => v / 255); return .2126 * canal(r) + .7152 * canal(g) + .0722 * canal(bl); };
  const lire = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const alpha = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return 1; const p = m[1].split(","); return p.length > 3 ? parseFloat(p[3]) : 1; };
  /* Compose les fonds translucides sur leurs ancêtres : sans ça, un badge
     posé sur rgba(...,.12) est comparé à sa propre teinte et tout ressort à 1:1. */
  const fondDe = el => {
    const couches = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      const a = alpha(c);
      if (a > 0) { couches.push({ rgb: lire(c), a }); if (a >= 1) break; }
    }
    let fond = [255, 255, 255];
    for (let i = couches.length - 1; i >= 0; i--) {
      const { rgb, a } = couches[i];
      fond = fond.map((v, k) => rgb[k] * a + v * (1 - a));
    }
    return fond;
  };
  const textes = [...document.querySelectorAll("p, span, div, li, td, h1, h2, h3, h4, button, a")]
    .filter(el => visible(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 3));
  const faibles = [];
  for (const el of textes.slice(0, 400)) {
    const s = getComputedStyle(el);
    const [x, y] = [lum(lire(s.color)), lum(fondDe(el))].sort((a, c) => c - a);
    const ratio = (x + .05) / (y + .05);
    const taille = parseFloat(s.fontSize), gras = +s.fontWeight >= 700;
    const seuil = (taille >= 24 || (taille >= 18.66 && gras)) ? 3 : 4.5;
    if (ratio < seuil) faibles.push({ nom: nomme(el), ratio: +ratio.toFixed(2), seuil, taille: Math.round(taille) });
  }

  /* 4 · accents primaires */
  const accent = (getComputedStyle(document.documentElement).getPropertyValue("--role-action-principale") || "#8C4A22").trim();
  const hex = h => { const m = h.replace("#", "").match(/../g); return m ? m.map(v => parseInt(v, 16)) : null; };
  const cible = hex(accent);
  const proche = (a, c) => a && c && Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1]) + Math.abs(a[2] - c[2]) < 40;
  const accents = interactifs.filter(el => proche(lire(getComputedStyle(el).backgroundColor), cible)).map(nomme);

  /* ── 5 · lignes de texte collées ───────────────────────────────────────
     Un <span> stylé comme une ligne (poids, taille, marge) mais laissé en
     display:inline se colle à son voisin : « Balisage sur le terrainSuivez
     le balisage… ». Le défaut est invisible en lisant le CSS et saute aux
     yeux à l'écran ; il a été introduit trois fois. On le mesure. */
  const collees = [];
  for (const el of document.querySelectorAll("span[class]")){
    const st = getComputedStyle(el);
    if (st.display !== "inline") continue;
    const freres = [...el.parentElement.children].filter(c => c.tagName === "SPAN" && c.className);
    if (freres.length < 2 || !freres.includes(el)) continue;
    /* Un inline qui passe à la ligne a un rectangle englobant inutile ici :
       il faut les boîtes de ligne. Le défaut, c'est que la DERNIÈRE ligne du
       premier et la PREMIÈRE du suivant partagent la même rangée. */
    const i = freres.indexOf(el), sv = freres[i + 1];
    if (!sv) continue;
    const ra = el.getClientRects(), rb = sv.getClientRects();
    if (!ra.length || !rb.length) continue;
    const a = ra[ra.length - 1], b = rb[0];
    if (Math.abs(a.top - b.top) < 4 && b.left >= a.right - 2)
      collees.push(el.className + " + " + sv.className + " — « " + (el.textContent || "").trim().slice(0, 30) + " »");
  }

  return { total: interactifs.length, petites, petitesAnno, nbAnno, anim, faibles: faibles.slice(0, 12), nbFaibles: faibles.length, accents, accentHex: accent, collees };
}, { CIBLE_MIN, CIBLE_ANNO });

/* Une mesure par étape, fusionnées : un défaut n'a pas besoin d'être sur
   l'écran d'accueil pour compter. */
const rapport = await mesurer();
const etapes = [];
for (const sel of parcours){
  try {
    await p.locator(sel).first().click({ timeout: 4000 });
    await p.waitForTimeout(700);
    const r = await mesurer();
    etapes.push(sel);
    rapport.total += r.total;
    rapport.nbAnno += r.nbAnno;
    for (const k of ["petites", "petitesAnno", "anim", "faibles", "accents", "collees"])
      rapport[k] = [...rapport[k], ...r[k]];
    rapport.nbFaibles += r.nbFaibles;
  } catch { console.error(`  (étape ignorée, introuvable : ${sel})`); }
}
/* Une même paire collée revue à chaque étape ne compte qu'une fois. */
rapport.collees = [...new Set(rapport.collees)];
rapport.accents = [...new Set(rapport.accents)];

await b.close();

/* ── rapport ── */
let bloquantes = 0, avert = 0;
const bloc = t => console.log("\n\x1b[1m" + t + "\x1b[0m");
const ko = m => { console.log("  \x1b[31m✕\x1b[0m " + m); bloquantes++; };
const at = m => { console.log("  \x1b[33m!\x1b[0m " + m); avert++; };
const ok = m => console.log("  \x1b[32m✓\x1b[0m " + m);

console.log(`\n\x1b[1mÉcran vérifié\x1b[0m  ${url}  —  ${largeur}×${hauteur}` +
  (etapes.length ? `  —  ${etapes.length} étape(s) de parcours` : ""));

bloc(`1 · Cibles tactiles — minimum ${CIBLE_MIN} px (WCAG 2.2 SC 2.5.8 exige 24 ; on double pour la marche)`);
if (!rapport.petites.length && !rapport.petitesAnno.length)
  ok(`${rapport.total} éléments interactifs conformes, dont ${rapport.nbAnno} annotation(s) de carte au seuil de ${CIBLE_ANNO} px`);
else if (rapport.petitesAnno.length){
  ko(`${rapport.petitesAnno.length} annotation(s) de carte sous ${CIBLE_ANNO} px`);
  for (const c of rapport.petitesAnno.slice(0, 5)) console.log(`      ${c.l}×${c.h} — « ${c.nom} »`);
}
if (rapport.petites.length){
  ko(`${rapport.petites.length} cibles sur ${rapport.total} sous ${CIBLE_MIN} px`);
  for (const c of rapport.petites.slice(0, 8)) console.log(`      ${c.l}×${c.h} — « ${c.nom} »`);
  if (rapport.petites.length > 8) console.log(`      … et ${rapport.petites.length - 8} autres`);
}

bloc(`2 · Mouvement en boucle — maximum ${CLIGNOTEMENTS_MAX} (le point du direct)`);
if (rapport.anim.length <= CLIGNOTEMENTS_MAX) ok(`${rapport.anim.length} élément(s) en boucle`);
else { ko(`${rapport.anim.length} éléments bouclent en permanence`); for (const a of rapport.anim.slice(0, 6)) console.log(`      ${a.animation} — « ${a.nom} »`); }

bloc("3 · Contraste rendu");
if (!rapport.nbFaibles) ok("Tous les textes échantillonnés passent le seuil AA");
else { ko(`${rapport.nbFaibles} textes sous le seuil`); for (const f of rapport.faibles.slice(0, 8)) console.log(`      ${f.ratio}:1 (exigé ${f.seuil}, ${f.taille}px) — « ${f.nom} »`); }

bloc(`4 · Règle du seul accent — maximum ${ACCENTS_MAX} par écran (${rapport.accentHex})`);
if (rapport.accents.length <= ACCENTS_MAX) ok(`${rapport.accents.length} accent(s) primaire(s)`);
else { at(`${rapport.accents.length} éléments portent l'accent primaire`); for (const a of rapport.accents.slice(0, 6)) console.log(`      « ${a} »`); }

bloc("5 · Lignes de texte collées — un span stylé en ligne mange le retour");
if (!rapport.collees.length) ok("Aucune ligne collée à sa voisine");
else { ko(`${rapport.collees.length} paire(s) de lignes collées`); for (const c of rapport.collees.slice(0, 8)) console.log(`      ${c}`); }

console.log(`\n\x1b[31m${bloquantes} bloquantes\x1b[0m, \x1b[33m${avert} avertissements\x1b[0m\n`);
process.exit(bloquantes ? 1 : 0);
