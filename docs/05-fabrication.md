# Comment ces applications sont fabriquées — et comment nous fabriquons la nôtre

> Cinquième document. Les documents 02 à 04 disent *quoi* faire. Celui-ci dit
> *comment on s'y prend*, et surtout comment on empêche les règles de se
> dissoudre pendant les six mois de développement.

---

# Partie 1 — Comment le métier fabrique une application

## 1.0 Ce que la recherche trouve, et ce qu'elle ne trouve pas

**Point important, et un peu décevant :** ni Strava ni AllTrails ne publient
leur processus de design. Ce qui circule sous les titres « Strava design
system » ou « AllTrails case study » est presque exclusivement du **travail de
portfolio non sollicité** — des refontes faites par des designers indépendants
ou des étudiants, sans accès à l'entreprise, à ses recherches ou à ses
arbitrages. Ces documents sont utiles comme exercices de style ; ils ne
documentent pas comment ces produits ont été faits.

Ce qui est public, documenté et fiable se trouve ailleurs, à trois endroits :

1. **Les systèmes de design des grandes plateformes** — Material Design 3
   (Google), Human Interface Guidelines (Apple), Polaris (Shopify), Carbon
   (IBM). Ils publient non seulement leurs composants, mais leurs *valeurs* :
   durées, courbes, échelles, seuils.
2. **Les standards** — la spécification des design tokens du W3C, WCAG pour
   l'accessibilité.
3. **La documentation des outils** — Figma, Style Dictionary, Storybook,
   Tokens Studio.

C'est de là que vient la réponse à « comment ils font ». Ce n'est pas un secret
d'atelier : c'est une chaîne technique publique, que presque personne ne monte
en entier.

---

## 1.1 Le processus : le double diamant

Le cadre dominant reste le **double diamant** du Design Council britannique :
quatre phases groupées en deux losanges, chacun ouvrant (pensée divergente)
puis refermant (pensée convergente).

```
   ◇ Découvrir → Définir        ◇ Développer → Livrer
   ── espace du problème ──     ── espace de la solution ──
```

La mise à jour de 2019 y a ajouté quatre principes d'action : mettre les gens
d'abord, communiquer visuellement et de façon inclusive, collaborer et
co-créer, itérer constamment.

Deux choses à retenir, parce que ce sont celles que tout le monde rate :

- **L'erreur la plus fréquente est de sauter le premier losange** — se
  précipiter sur des solutions avant d'avoir défini le problème. Nous l'avons
  évitée par accident : les documents 01 à 03 sont entièrement dans le premier
  losange.
- **Ce n'est pas une cascade, c'est une boucle.** Une découverte en phase de
  définition renvoie à l'exploration ; un test de prototype a le droit de
  remettre en cause la définition du problème.

## 1.2 Qui fait le travail

Dans une équipe produit constituée, cinq métiers se partagent ce que les
non-spécialistes appellent « le design » :

| Métier | Ce qu'il produit | Peut-on s'en passer au début ? |
|---|---|---|
| **Product designer** | Flux, écrans, prototypes, arbitrages | Non — c'est le poste central |
| **UX researcher** | Entretiens, tests d'usage, synthèses | Oui, si le designer fait ses propres tests terrain |
| **Content designer** | Libellés, ton, messages d'erreur, notifications | Oui — mais c'est la première embauche à regretter |
| **Design engineer** | Le système en code, les composants, la chaîne de tokens | **Non** — sans lui le système reste une intention |
| **Design ops** | Gouvernance, outils, rituels, documentation | Oui, jusqu'à ~3 designers |

Pour Points P-O, la lecture réaliste : **un product designer qui code** (ou un
développeur qui a du goût et suit un système), plus le réseau de guides comme
source de recherche terrain gratuite et de très bonne qualité. Le poste qu'il
ne faut pas faire semblant d'avoir, c'est le design engineer — c'est lui qui
transforme les règles en contraintes.

## 1.3 L'artefact central n'est pas la maquette

C'est le point que les études visuelles ne montrent pas. Dans une équipe qui
livre, **la maquette est un jetable** ; ce qui est maintenu, c'est le système :

> Un système de design = une bibliothèque de composants **+** des tokens **+**
> des principes **+** de la documentation **+** une gouvernance.

L'organisation dominante reste l'**atomic design** de Brad Frost — atomes,
molécules, organismes, gabarits, pages — avec **Storybook** comme atelier : les
composants y sont construits et testés isolément, puis publiés comme une
dépendance que l'application consomme.

La question de 2026 dans les équipes n'est plus « quels composants ? » mais
**la gouvernance** : qui possède quoi, ce qui constitue un changement approuvé,
comment un composant passe de brouillon à production.

## 1.4 Les tokens : la vraie réponse technique

C'est la pièce que la plupart des gens ignorent et qui explique la cohérence
des grandes applications.

Un **design token** est une décision de design stockée comme donnée :
`{ "$value": "#8C4A22", "$type": "color" }`. Les tokens sémantiques pointent
vers des tokens primitifs (`action-principale` → `bistre`), ce qui rend la
décision portable entre les outils au lieu d'être recopiée dans chaque
plateforme.

**Ce qui a changé récemment :** le Design Tokens Community Group du W3C a
publié sa première spécification stable — **version 2025.10, le 28 octobre
2025** — soutenue par plus de quarante organisations dont Adobe, Figma, Google,
Microsoft, Shopify et Salesforce. Le format est du JSON : `$value`, `$type`, et
des références par chemin.

Conséquence pratique : **Style Dictionary v4** lit nativement ce format, les
Variables Figma s'exportent dedans, et Figma, Penpot, Sketch, Tokens Studio et
Terrazzo le lisent ou l'écrivent. Un token défini une fois circule de la
conception au code sans script d'export sur mesure — ce qui était, jusqu'ici,
la raison pour laquelle la plupart des équipes abandonnaient la chaîne à
mi-parcours.

**C'est exactement la chaîne que nous venons de monter** (partie 2).

## 1.5 Le mouvement, standardisé

Material Design 3 publie ses **tokens de mouvement**, et c'est le meilleur
modèle disponible :

- Deux jeux de courbes : **Emphasized** (recommandé pour la plupart des
  transitions) et **Standard** (quand on privilégie la vitesse sur le naturel).
- Trois courbes dans chaque jeu : la courbe pleine, *decelerate* (entrée à
  vitesse maximale puis ralentissement) et *accelerate* (accélération puis
  sortie à vitesse maximale).
- Quatre familles de durées : *short*, *medium*, *long*, *extra long*.
- Usage : la courbe *emphasized* pour le contenu qui entre dans le cadre
  (transformations de conteneur, transitions de page) ; la courbe *standard*
  pour les micro-interactions.

> **À vérifier à la source :** les valeurs exactes en millisecondes et les
> `cubic-bezier` sont publiées sur `m3.material.io/styles/motion/easing-and-duration/tokens-specs`.
> Ce domaine est bloqué depuis l'environnement de travail ; les chiffres n'ont
> donc pas été recopiés ici pour ne pas risquer une erreur. **Nos six rythmes
> (document 03) sont plus restrictifs que Material par choix** — c'est une
> décision produit, pas une ignorance de la norme.

## 1.6 Le passage à la production, en 2026

Le « handoff » n'existe plus comme moment. Figma a ouvert un **serveur MCP en
mode développeur** : un service local qui expose le contenu structuré d'un
fichier Figma via le Model Context Protocol, de sorte qu'un agent de code
(Claude Code, Cursor, Windsurf) lise la hiérarchie, les règles de mise en page,
les styles de texte, les propriétés de composants, les variables et les
correspondances Code Connect — au lieu d'interpréter une capture d'écran. Il
s'active dans les préférences d'un fichier de conception, avec un siège Dev ou
Full.

Autrement dit : **la maquette devient une source interrogeable en continu**,
pas un document transmis une fois.

## 1.7 Les contraintes qui ne se négocient pas

**WCAG 2.2** est la référence, et deux critères nous concernent directement :

- **SC 2.5.8 — Taille de cible (minimum), niveau AA** : les cibles doivent
  faire au moins **24 × 24 pixels CSS**, sauf si l'espacement autour suffit
  (l'« offset » atteint 24 px), si la taille est imposée par le navigateur, ou
  si la cible est dans une phrase. Objectif : les personnes à motricité fine
  limitée et les usagers d'écrans tactiles.
- **Contraste 4,5:1** en AA pour le texte courant.

Nous doublons volontairement la première (48 px) : le contexte n'est pas un
bureau mais une main gantée qui tremble sur un sentier.

> **À faire vérifier par un juriste :** l'applicabilité de la réglementation
> européenne sur l'accessibilité des services numériques à une application
> grand public de ce type. Je ne l'ai pas confirmée dans cette recherche et ne
> l'affirme donc pas.

## 1.8 Le socle technique d'une application de ce genre

Les trois briques difficiles d'une app de randonnée narrative :

| Besoin | Solution éprouvée | Remarque |
|---|---|---|
| Position en arrière-plan | `react-native-background-geolocation` | Module de suivi et de géorepérage multiplateforme, avec détection de mouvement économe en batterie — c'est le point critique : un GPS naïf vide la batterie en trois heures |
| Cartes hors ligne | **MapLibre React Native** | Fork open source du SDK Mapbox, API identique, **n'importe quelle source de tuiles**, sans compte Mapbox ; un `OfflineManager` gère les paquets téléchargés |
| Récit audio géolocalisé | Lecteur audio natif + déclenchement par géorepérage | La combinaison carte hors ligne + guide audio est un cas d'usage documenté de MapLibre |

MapLibre permet en outre de brancher les tuiles de l'IGN plutôt que celles d'un
fournisseur commercial — ce qui compte pour un produit de territoire.

## 1.9 L'ordre de grandeur

Ce que coûte réellement la fabrication, pour cadrer les attentes :

| Poste | Effort réaliste |
|---|---|
| Système de design (tokens, composants, docs) | 3 à 6 semaines de design engineer, puis entretien continu |
| Application native V1 (4 écrans, hors ligne, GPS, audio) | 4 à 6 mois à deux développeurs |
| Contenu éditorial : 91 Éclats sourcés | ~4 h par Éclat → **~360 h**, plus les repérages terrain |
| Recherche terrain (tests P0–P3, document 02) | 6 semaines cumulées, étalées |

La ligne qui saute en premier dans les budgets serrés est la troisième. C'est
aussi la seule qui différencie le produit d'un AllTrails moins bon.

---

# Partie 2 — Comment nous le mettons en place

## 2.0 Le principe qui commande tout le reste

> **Une règle écrite dans un document est une intention.
> Une règle vérifiée par un script est une contrainte.**

Les documents 02 et 03 énoncent une trentaine de règles d'attention. Aucune ne
survivra à six mois de développement sous forme de PDF : elles s'érodent une
par une, chaque entorse étant justifiée localement. La seule parade connue est
de les **exécuter**.

C'est ce que fait le dossier `design/`, monté aujourd'hui.

## 2.1 Ce qui existe déjà dans le dépôt

```
design/
├── tokens/              6 fichiers au format W3C DTCG
│   ├── couleur.json       socle + rôles + déclinaison nuit
│   ├── duree.json         les six rythmes autorisés
│   ├── mouvement.json     les courbes, avec la dissymétrie entrée/sortie
│   ├── typo.json          familles et échelle
│   ├── espace.json        pas d'espacement + cible tactile minimale
│   └── attention.json     le budget hebdomadaire et les quotas, lisibles par machine
├── construire.mjs       génère build/tokens.css et build/tokens.ts (sans dépendance)
├── verifier-tokens.mjs  contrôles statiques
├── verifier-ecran.mjs   contrôles sur écran rendu, via navigateur
└── style-dictionary.config.mjs   le chemin de production (Swift, Kotlin, Compose)
```

Trois commandes :

```bash
node design/construire.mjs                            # 70 tokens → CSS + TS
node design/verifier-tokens.mjs app                   # contraste, durées, zone du jaune
node design/verifier-ecran.mjs http://…/app/index.html  # cibles, mouvement, contraste rendu
```

Le point important : **`tokens/attention.json` rend le budget d'attention
lisible par une machine.** Les quotas — 2 notifications par semaine, 1 seul
clignotement dans l'app, 1 accent par écran — ne sont plus des phrases dans un
document, ce sont des valeurs que le vérificateur lit.

## 2.2 Ce que le vérificateur a trouvé sur notre propre prototype

Première exécution, résultats réels :

**Sur les tokens** — le rôle `texte.tertiaire` était à **4,05:1**, sous le seuil
de 4,5. Corrigé dans `couleur.json` (`#7E7461` → `#6E6553`, 5,06:1). *Le token
change, pas le seuil.*

**Sur l'écran rendu** (fiche Sentiers, 390 × 844) :

| Contrôle | Résultat |
|---|---|
| Cibles tactiles | **9 sur 13 sous 48 px** — les filtres font 27 px de haut, le bouton de réinitialisation 32 × 32 |
| Contraste rendu | **5 textes sous le seuil** — le badge « Intermédiaire » est à 2,96:1 |
| Mouvement en boucle | 0 — conforme |
| Règle du seul accent | conforme |

**Sur le code** — 32 durées littérales hors token (2000 ms, 3000 ms, 25000 ms…),
et le jaune présent 2 fois hors de sa zone autorisée.

C'est exactement le but. Le prototype a été écrit *après* le document 03 par
quelqu'un qui l'avait en tête, et il viole quand même une bonne partie de ses
règles. Aucune relecture humaine n'aurait attrapé les 27 pixels des filtres.

## 2.3 Encoder les règles qui restent

Trois règles ne se vérifient pas par analyse : il faut les rendre
**impossibles à violer** par la forme du code.

### Le son, sans paramètre d'escalade

```ts
// son/deverrouillage.ts — le seul module autorisé à produire un son.
const ECLAT = { notes: [587.33, 880.0], duree: 340, attaque: 12, niveau: -18 };

/** Joue le son de déverrouillage. Aucun paramètre : c'est le sujet. */
export function jouerDeverrouillage(contexte: Contexte): void {
  if (contexte.mode !== "sentier") return;   // jamais dans la navigation
  if (!contexte.sonActif) return;
  synthetiser(ECLAT);                        // constante, hors de portée de l'appelant
}
```

Il n'existe pas de `jouerDeverrouillage(niveau)`. L'escalade n'est pas
interdite par une règle : elle est **inexprimable**.

### Les notifications, par un entonnoir unique

```ts
// notifications/envoyer.ts
type Notification = {
  titre: string;
  information: string;        // obligatoire : le contenu utile, pas une promesse
  quand: Date;                // pas d'optimisation d'horaire : on passe l'heure voulue
  securite?: true;            // seul cas qui échappe au quota
};

export async function envoyer(n: Notification) {
  if (!n.securite && (await compteurSemaine()) >= QUOTA_HEBDO) return refuser("quota");
  if (longueurEcranVerrouille(n) > LIMITE) return refuser("tronquée");   // §7 doc 03
  if (/\b(vous avez|ne ratez|revenez|surprise)\b/i.test(n.titre)) return refuser("appât");
  return remettre(n);
}
```

Il n'y a **aucun autre chemin** vers le système de notification. Le quota, le
refus des libellés d'appât et l'interdiction des notifications tronquées ne
sont pas une politique : c'est le seul code qui sait notifier.

### Le jaune, enfermé dans un composant

```tsx
// Eclat/Deverrouillage.tsx — le seul fichier qui a le droit de lire ce token.
const JAUNE = jeton("role.attention-deverrouillage");
```

Et dans les tokens, la zone est déclarée — c'est ce que le vérificateur lit :

```json
"$extensions": {
  "camins.usage": "deverrouillage-seul",
  "camins.fichiers-autorises": ["Eclat/*", "ModeSentier/Deverrouillage*"]
}
```

### Le manifeste d'écran

Chaque écran déclare ce qu'il demande. Le vérificateur additionne.

```ts
export const manifeste = {
  nom: "FicheRecit",
  accentPrimaire: "demarrer-mode-sentier",   // un seul, nommé
  coutAttention: { poste: "preparation", ms: 4 * 60_000 },
  animationsEnBoucle: 0
};
```

## 2.4 Le plan, en quatre incréments

| Incrément | Contenu | Critère de sortie |
|---|---|---|
| **A — Le système** (3 sem.) | Tokens complétés (états, ombres, icônes), composants de base en Storybook, les deux vérificateurs en CI | La CI échoue sur une violation introduite exprès |
| **B — Un sentier réel** (6 sem.) | Application native minimale : carte hors ligne, un Récit, déverrouillage GPS, lecteur d'Éclat, mode Sentier | 80 % de déverrouillages réussis sur le terrain, < 12 %/h de batterie |
| **C — La Veillée** (4 sem.) | Direct, chat, drop à prix fixe et tirage | ≥ 4 % de conversion sur 4 Veillées |
| **D — Le Cycle** (3 mois) | Cabinet, cartes-témoins, carnet imprimé, Ratio Camins instrumenté | ≥ 30 % des inscrits terminent 2 Récits |

L'incrément A **passe avant** tout écran définitif : c'est lui qui rend les
trois suivants tenables. Sur le choix de la direction visuelle, l'incrément A
n'a pas besoin d'être tranché — les tokens sémantiques permettent de changer
tout le socle en modifiant `couleur.json`.

## 2.5 L'intégration continue

`.github/workflows/design.yml` fait tourner, à chaque pull request touchant
`design/` ou `app/` :

1. la régénération des tokens, et **l'échec si `build/` n'est pas à jour** —
   personne ne modifie le CSS généré à la main ;
2. les contrôles statiques ;
3. les contrôles sur écran rendu, dans un vrai Chromium.

L'**audit trimestriel de dette d'attention** (document 03, §10) devient une
tâche planifiée qui ouvre une issue listant tout ce qui bouge, sonne, vibre ou
notifie, et exige pour chaque entrée l'information qu'elle porte.

## 2.6 Ce qu'il faut acheter, et ce qui est gratuit

| Poste | Coût | Commentaire |
|---|---|---|
| Figma, siège Dev ou Full | payant | Nécessaire pour le serveur MCP en mode développeur |
| Tokens Studio | gratuit / payant | Utile seulement si un designer travaille dans Figma ; nos tokens sont écrits à la main aujourd'hui |
| Style Dictionary, Storybook, MapLibre | gratuit | Open source |
| Fond cartographique IGN | gratuit depuis 2024 | Meilleur qu'OSM en montagne ; MapLibre accepte n'importe quelle source de tuiles |
| `react-native-background-geolocation` | licence payante par application | La version gratuite ne couvre pas le suivi en arrière-plan en production |
| Enregistrement et montage audio | ~4 h par Éclat | Le vrai poste |

## 2.7 Les pièges connus

1. **Le système meurt s'il n'est pas en CI.** Un système de design que rien ne
   vérifie devient de la documentation en trois mois.
2. **Les tokens sémantiques d'abord.** Nommer un token `bistre` et l'utiliser
   partout condamne à tout renommer au premier changement de direction ;
   `action-principale` survit au changement.
3. **Ne jamais modifier `design/build/` à la main.** La CI le vérifie.
4. **Le GPS en arrière-plan est le vrai risque technique**, pas le design :
   c'est là que se jouent la batterie, la fiabilité du déverrouillage et les
   autorisations système. À prototyper en premier dans l'incrément B.
5. **Un vérificateur qui produit des faux positifs sera désactivé.** Le nôtre a
   déjà dû être corrigé une fois : il comparait un badge à sa propre teinte
   translucide et sortait 1:1 partout. Corrigé par composition alpha sur les
   ancêtres — c'est le genre de dette qu'il faut payer immédiatement.

---

## Sources

**Design tokens et chaîne d'outils**
- [Design Tokens Just Became a Real W3C Standard](https://mohitphogat.medium.com/design-tokens-just-became-a-real-w3c-standard-heres-what-changes-952fa9eb31fb)
- [Design Tokens in 2026: The W3C Format](https://blog.codercops.com/blog/design-tokens-2026-w3c-format-guide)
- [Design tokens with the W3C standard](https://malakavenu.com/articles/design-tokens-w3c-2026)
- [The Design Token Spec Is Finally Real. Now What?](https://themotiondesign.com/writing/design-token-spec-finally-real-now-what)
- [Figma Design Tokens: Variables & DTCG](https://atomize.tools/blog/figma-tokens-guide/)

**Processus**
- [What is the Double Diamond design process? — LogRocket](https://blog.logrocket.com/ux-design/double-diamond-design-process/)
- [Double Diamond Design Process — UXPin](https://www.uxpin.com/studio/blog/double-diamond-design-process/)
- [Understanding the Double Diamond — Dovetail](https://dovetail.com/product-development/what-is-the-double-diamond-design-process/)

**Systèmes de design**
- [Atomic Design and Storybook — Brad Frost](https://bradfrost.com/blog/post/atomic-design-and-storybook/)
- [How to Maintain a Design System: 2026 Management Guide](https://www.parallelhq.com/blog/building-maintaining-design-system)
- [10 Essential Design System Components — UXPin](https://www.uxpin.com/studio/blog/design-system-components/)

**Mouvement**
- [Easing and duration — Material Design 3](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)

**Handoff**
- [Introducing our Dev Mode MCP server — Figma](https://www.figma.com/blog/introducing-figma-mcp-server/)
- [Design to Code with the Figma MCP Server — Builder.io](https://www.builder.io/blog/figma-mcp-server)

**Accessibilité**
- [Web Content Accessibility Guidelines (WCAG) 2.2 — W3C](https://www.w3.org/TR/WCAG22/)
- [Target Size (Minimum) — WCAG 2.2 SC 2.5.8](https://wcag22aa.org/new-criteria/target-size/)
- [Understanding Target Size Under WCAG 2.2 — BOIA](https://www.boia.org/blog/understanding-target-size-under-wcag-2.2-and-how-it-affects-people-with-disabilities)

**Socle technique**
- [MapLibre React Native](https://maplibre.org/maplibre-react-native/)
- [OfflineManager — MapLibre React Native](https://maplibre.org/maplibre-react-native/docs/modules/offline-manager/)
- [react-native-background-geolocation — npm](https://www.npmjs.com/package/react-native-background-geolocation)
- [react-native-maps vs Mapbox RN vs MapLibre RN](https://www.pkgpulse.com/guides/react-native-maps-vs-mapbox-rn-vs-maplibre-rn-mobile-2026)
