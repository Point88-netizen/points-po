# Camins — application de randonnée narrative en Occitanie

> **Camins** (occitan : *les chemins*) — l'application de randonnée de Points P-O.
> Positionnement : *AllTrails pour trouver le sentier, Strava pour la trace,
> Camins pour savoir où l'on marche.*

---

## 1. Le pari

AllTrails et Strava ont résolu deux problèmes : **trouver un itinéraire** et
**mesurer un effort**. Aucun des deux ne répond à la question que se pose le
marcheur devant un mur de pierres sèches, une croix de fer rouillée ou un
village vidé : *qu'est-ce qui s'est passé ici ?*

Camins ajoute une troisième couche — **le récit géolocalisé** — et la restreint
volontairement à un seul territoire : **l'Occitanie**.

La restriction n'est pas une limite, c'est la proposition de valeur :

| Choix | Conséquence |
|---|---|
| Une seule région | Densité narrative impossible à égaler par un acteur global |
| 13 départements, ~1 500 ans d'histoire dense | Assez de matière pour 10 ans de contenu |
| Auteurs locaux (guides, historiens, ethnologues) | Défendable : ni scrapable, ni générable |
| Occitan / catalan présents dans l'app | Marqueur d'authenticité, pas décoratif |

**Ce que Camins n'essaie pas d'être :** un réseau social de sport, un
classement, un GPS de secours, une app nationale.

---

## 2. Les trois objets du produit

### 2.1 Le Sentier
Un itinéraire classique : trace GPX, distance, dénivelé, difficulté, saison,
points d'eau, accès, parking, transports. Rien d'original — c'est le socle
d'utilité qui doit être **au niveau d'AllTrails ou l'app est morte**.

### 2.2 L'Éclat
L'unité narrative. Un **Éclat** est un fragment d'histoire attaché à un point
GPS précis sur un sentier.

- Format : **vertical, 60 à 120 secondes**, audio dominant (on marche, on ne
  lit pas), avec une image d'archive, une carte ancienne ou une photo.
- Auteur : un guide, un historien, un habitant, un archiviste — **nommé et
  crédité**.
- Voix : humaine. Pas de synthèse vocale sur les récits (règle éditoriale).
- Exemples :
  - *Montségur, station 4* — « Le champ des cramats » : ce que les fouilles de
    1964 ont trouvé, et ce qu'elles n'ont pas trouvé.
  - *Larzac, station 2* — pourquoi une lavogne est ronde, et qui la creusait.
  - *Mont Lozère, station 6* — la voix d'un descendant de camisards, enregistrée
    en 1978 par un ethnomusicologue, retrouvée aux archives de Mende.

**Règle d'or, non négociable :** *un Éclat ne se débloque que sur place, à pied,
dehors.* Voir §3.

### 2.3 Le Récit et le Cycle
- Un **Récit** = 5 à 9 Éclats sur un même sentier. Il forme un chapitre complet.
- Un **Cycle** = une saison thématique de 3 mois qui traverse plusieurs
  départements et relie les Récits entre eux.

Cycles prévus :

| Cycle | Thème | Territoires |
|---|---|---|
| I — *Le siècle du bûcher* | Croisade albigeoise, 1209–1244 | Montségur (09), Carcassonne & Lastours (11), Cordes (81), Minervois |
| II — *La pierre et l'eau* | Art roman, abbayes, canal | Saint-Guilhem (34), Conques (12), Flaran (32), Canal du Midi |
| III — *Le sel, la laine, la transhumance* | Économies pastorales | Larzac (12), Aubrac (12/48), Aigues-Mortes (30), Capcir (66) |
| IV — *Les langues qui résistent* | Occitan, catalan, camisards | Mont Lozère (48), Conflent (66), Comminges (31) |

---

## 3. La règle d'or : le déverrouillage par la marche

**Un Éclat ne s'écoute qu'au point où il a eu lieu.**

Condition de déverrouillage :
1. Position GPS dans un rayon de 80 m de la station, **et**
2. présence continue > 45 s (filtre les passages en voiture), **et**
3. vitesse moyenne des 10 dernières minutes < 8 km/h (filtre le vélo et la
   voiture — un trail runner à 12 km/h en descente reste couvert par la
   moyenne).

Conséquences, et c'est tout l'intérêt :

- **La récompense exige de quitter l'écran.** Le contenu n'est pas consommable
  depuis le canapé. On ne peut pas « binge » Camins.
- **Le plafond de consommation est physique.** Une bonne journée de marche
  = 6 à 9 Éclats. Il n'existe pas de session de 4 heures.
- **La rétention devient hebdomadaire ou saisonnière**, jamais quotidienne — ce
  qui correspond à la vraie fréquence de la randonnée (1 à 4 sorties/mois).

Cette contrainte est aussi le principal garde-fou anti-dépendance du produit.
Elle est détaillée avec ses risques en §4 du document [02-retention-ethique.md](02-retention-ethique.md).

**Accessibilité — exception assumée :** le mode *Fauteuil* déverrouille tous les
Éclats sans condition, sur demande, sans justificatif et sans marquage visible
dans l'interface. Un produit qui rend l'histoire d'une région conditionnelle à
la capacité de marcher serait indéfendable. La règle d'or est un choix de
design contre l'écran, pas un test d'aptitude physique.

---

## 4. Architecture de l'app

```
┌─────────────────────────────────────────────────────────────┐
│  SENTIERS        ÉCLATS          VEILLÉE       CABINET       │
│  (carte + GPX)   (lecteur)       (live hebdo)  (collection)  │
└─────────────────────────────────────────────────────────────┘
        │              │               │              │
        └──────────────┴───────┬───────┴──────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Mode Sentier      │  ← écran éteint, audio seul,
                    │   (offline first)   │     déclenchement automatique
                    └─────────────────────┘
```

**Quatre onglets. Pas cinq.** Chaque onglet ajouté est un onglet de rétention
artificielle.

### 4.1 Sentiers
Carte Occitanie, filtres (durée, dénivelé, difficulté, département, saison,
accès sans voiture), fiche sentier, téléchargement hors-ligne obligatoire avant
départ (couverture réseau en montagne).

### 4.2 Éclats
Lecteur vertical plein écran, mais **conçu pour être écouté écran dans la
poche** : lecture automatique à l'arrivée sur la station, contrôle par les
boutons de volume, transcription texte disponible pour les sourds et
malentendants.

### 4.3 Veillée
Le rendez-vous live hebdomadaire. Voir §5 et le document rétention.

### 4.4 Cabinet
La collection : Éclats écoutés, Récits complétés, Cycles, cartes-témoins.
Consultable hors-ligne. **Pas de score, pas de classement public.**

### 4.5 Mode Sentier
Quand une randonnée démarre, l'app passe en mode dégradé volontaire :
écran noir, notifications coupées, seuls l'audio et l'alerte de sécurité
passent. **Le mode Sentier est l'état par défaut de l'app en randonnée.**

---

## 5. La Veillée — le rendez-vous

Inspiré de la mécanique de *live show* (Whatnot), transposé du commerce au
récit :

- **Jeudi, 21h00, 40 minutes.** Toujours. Jamais plus.
- Un hôte : un guide ou un historien du territoire, en direct.
- Un récit long qu'on ne peut pas obtenir en marchant (archives, entretien,
  débat entre deux historiens qui ne sont pas d'accord).
- Des **drops** : 8 à 20 places de randonnée guidée réelle mises en vente en
  direct, tirage au sort si sur-demande (pas d'enchère — voir garde-fous).
- Des attentions : l'hôte nomme les marcheurs qui ont terminé un Récit dans la
  semaine, répond aux questions du chat, offre 3 cartes-témoins.
- **Rediffusion disponible dès le lendemain**, sans limite de temps. Le live
  crée le rendez-vous, pas la peur de rater.

**Pourquoi c'est le bon modèle économique :** Points P-O vend déjà des
randonnées guidées de 38 à 180 €. La Veillée est un canal de vente qui produit
de la rétention *sans publicité et sans revendre l'attention*. La monétisation
et la rétention pointent dans la même direction : faire sortir les gens.

---

## 6. Modèle économique

| Source | Détail | Rôle |
|---|---|---|
| Randonnées guidées | 38–180 €, existant, vendues en Veillée | Cœur du revenu |
| Abonnement *Cycle* | 4 €/mois ou 36 €/an — accès aux Cycles complets | Récurrence |
| Gratuit | 2 Récits complets + tous les GPX + la carte | Acquisition |
| Éditions | Carnets papier de fin de Cycle, cartes | Marge, objet mémoire |
| Partenariats territoire | Parcs naturels, départements, offices de tourisme | Contenu + financement |
| **Publicité** | **Aucune. Jamais.** | — |

Sans publicité, le temps passé dans l'app n'a aucune valeur pour nous. C'est la
condition structurelle qui rend les garde-fous du §7 crédibles plutôt que
cosmétiques.

---

## 7. Contenu : volume et production

Cible V1 (12 mois) :

- **13 sentiers**, un par département, ~7 Éclats chacun = **91 Éclats**
- **4 Cycles** amorcés
- **40 Veillées** (une par semaine hors août et fêtes)

Production : 1 Éclat = ~4 h de travail (recherche archives, écriture,
enregistrement, montage, repérage GPS). Soit ~360 h pour la V1, plus la
captation terrain. Réaliste pour 1 ETP éditorial + le réseau de guides existant.

**Sources historiques :** archives départementales (66, 11, 09, 48…), fonds
ethnographiques régionaux, sociétés savantes, thèses. Chaque Éclat porte ses
sources dans l'app, consultables. Un récit non sourcé n'est pas publié.

---

## 8. Ce qui reste à trancher

1. **Native ou PWA ?** Le déverrouillage GPS en arrière-plan et l'audio
   écran-éteint poussent vers le natif (React Native / Flutter). Une PWA suffit
   pour valider le concept mais pas pour le mode Sentier.
2. **Fond cartographique** : IGN (Géoplateforme, gratuit depuis 2024, excellent
   en montagne) contre OpenStreetMap/OpenTopoMap. Probablement IGN + bascule
   OSM hors-ligne.
3. **Droits sur les archives sonores et photographiques** — à sécuriser avant
   toute production de masse.
4. **Le périmètre "Occitanie" est-il tenable commercialement ?** 6 M
   d'habitants + ~30 M de nuitées touristiques/an. Voir V2 : franchise du
   modèle par région plutôt qu'extension nationale de Camins.

---

## Documents liés

- [02-retention-ethique.md](02-retention-ethique.md) — l'étude de rétention :
  ce qu'on emprunte à Instagram et Whatnot, ce qu'on refuse, et pourquoi.
- [../app/index.html](../app/index.html) — prototype interactif cliquable.
