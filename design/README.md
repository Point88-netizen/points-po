# design/ — le système, pas les maquettes

Ce dossier est la source de vérité de l'apparence de Camins. Les maquettes
(`app/directions-visuelles.html`) montrent des intentions ; **ce dossier les
rend contraignantes.**

## La chaîne

```
tokens/*.json          format W3C DTCG — écrit à la main, ou exporté depuis Figma
      │
      ├─ construire.mjs          → build/tokens.css   (prototype web, aujourd'hui)
      │                          → build/tokens.ts    (React Native, demain)
      │
      ├─ verifier-tokens.mjs     contraste, durées, zone du jaune, quotas
      └─ verifier-ecran.mjs      cibles tactiles, mouvement, contraste rendu, accents
```

## Commandes

```bash
node design/construire.mjs                 # régénère build/
node design/verifier-tokens.mjs app        # contrôles statiques
node design/verifier-ecran.mjs <url>       # contrôles sur écran rendu (Playwright)
```

Les deux vérificateurs sortent en code 1 sur une règle bloquante : ils sont
faits pour être branchés en intégration continue (voir
`.github/workflows/design.yml`).

## La règle de fond

> Une règle écrite dans un document est une intention.
> Une règle vérifiée par un script est une contrainte.

Les documents [02](../docs/02-retention-ethique.md) et
[03](../docs/03-design-attention.md) énoncent des règles d'attention. Elles ne
survivront pas six mois de développement sous forme de PDF. Chaque règle qui
compte est donc encodée ici :

| Règle (document 03) | Où elle vit |
|---|---|
| Contraste 7:1 sur le fonctionnel | `verifier-tokens.mjs` §1 — le token change, pas le seuil |
| Six durées, et rien entre les deux | `tokens/duree.json` + `verifier-tokens.mjs` §2 |
| Le jaune réservé au déverrouillage | `$extensions.camins.fichiers-autorises` + §3 |
| Cibles 48 px | `tokens/espace.json` + `verifier-ecran.mjs` §1 |
| Un seul accent par écran | `tokens/attention.json` + `verifier-ecran.mjs` §4 |
| Un seul clignotement | idem, §2 |
| Budget d'attention hebdomadaire | `tokens/attention.json` — déclaratif, à tenir en revue |

## Passage en production

`construire.mjs` est un générateur sans dépendance, écrit pour que la chaîne
tourne aujourd'hui. Quand le projet passe en natif, on le remplace par Style
Dictionary (`style-dictionary.config.mjs`) : **le format d'entrée est le même**,
seules les sorties s'ajoutent (Swift, Kotlin, Compose).
