# Points P.O

Prototype d'application de randonnée et d'histoire pour les Pyrénées-Orientales,
et le système de design qui va avec.

Tout est en HTML, CSS et JavaScript sans framework. Il n'y a rien à compiler
pour voir l'application : un serveur de fichiers suffit.

## Travailler depuis votre ordinateur

```bash
git clone https://github.com/Point88-netizen/points-po.git
cd points-po
git checkout claude/hiking-app-occitanie-8erplx
```

Puis, pour voir l'application :

```bash
npm install          # une seule fois
npm run dev          # sert le dossier sur http://127.0.0.1:8899
```

Ouvrez <http://127.0.0.1:8899/app/index.html>.

> Le fichier s'ouvre aussi directement dans un navigateur (double-clic sur
> `app/index.html`), mais certains navigateurs bloquent alors le chargement de
> `design/build/tokens.css`. Le serveur évite ce piège.

Pour modifier l'interface, il n'y a qu'un fichier : **`app/index.html`**.
Structure, styles et code y tiennent ensemble, volontairement — le prototype
doit rester lisible d'un bout à l'autre.

## Vérifier avant de committer

Deux vérificateurs remplacent la relecture à l'œil. Ils ont trouvé des défauts
qu'aucune relecture n'aurait vus : un contraste à 4,18:1, une jauge rendue sur
zéro pixel, deux points qui clignotaient au lieu d'un.

```bash
npm run navigateur   # une seule fois : installe Chromium pour Playwright
npm run dev          # dans un terminal
npm run verif        # dans un autre
```

- `verif:tokens` lit le code : contrastes déclarés, durées hors rythme,
  couleurs hors de leur zone, quotas.
- `verif:ecran` lit le résultat rendu dans un vrai navigateur : cibles
  tactiles, animations en boucle, contraste réel, accent unique, lignes de
  texte collées, boîtes écrasées.

Un échec bloquant fait sortir en code 1 — c'est ce que la CI utilise.

Si vous touchez aux tokens (`design/tokens/*.json`) :

```bash
npm run tokens       # régénère design/build/
```

La CI refuse une modification de tokens dont `design/build/` n'aurait pas été
régénéré.

## Ce qu'il y a dans le dépôt

| Chemin | Contenu |
|---|---|
| `app/index.html` | L'application. Le fichier à modifier. |
| `app/v1-etude.html` | Le prototype d'étude précédent, conservé. |
| `app/directions-visuelles.html` | Neuf directions visuelles explorées. |
| `points-po-accueil.html` | La page d'accueil du site. |
| `design/tokens/` | Les tokens au format DTCG. La source. |
| `design/build/` | CSS et TypeScript générés. Ne pas modifier à la main. |
| `design/verifier-*.mjs` | Les deux vérificateurs. |
| `docs/` | Produit, rétention, design d'attention, directions, fabrication. |

## La palette

L'échelle Brasier, avec un rôle par valeur. Les confondre fait perdre l'orange
de la marque — c'est arrivé.

| | | Rôle |
|---|---|---|
| 100 | `#FDE5DD` | fond léger, badges |
| 300 | `#F99F83` | saumon — accents doux |
| 500 | `#F4511E` | **couleur principale, CTA** |
| 700 | `#A63A18` | texte et traits fins sur fond clair |
| 900 | `#692813` | texte foncé |

Neutres : Papier `#FAF7F2`, Encre `#1C1410`.

Le 500 porte l'action principale **avec du texte foncé** : 5,6:1, quand du
blanc tomberait à 2,9:1. Une seule surface orange par écran — le vérificateur
le contrôle.

## Continuer avec Claude Code en local

```bash
cd points-po
claude
```

La session démarre dans le dépôt, lit ce README et les fichiers, et travaille
sur la branche courante. Rien à faire de plus.
