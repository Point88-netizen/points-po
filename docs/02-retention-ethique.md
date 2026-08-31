# Étude — une rétention ludique qui ne rend pas dépendant

> Étude de conception pour **Camins** (voir [01-produit-camins.md](01-produit-camins.md)).
> Objet : construire une mécanique de rétention forte en empruntant aux codes
> d'Instagram et de Whatnot, **sans reproduire leur modèle de captation**.

---

## Note de méthode

La vidéo YouTube fournie en référence (`youtube.com/watch?v=IQP_2wnEgoY`) **n'a
pas pu être consultée** : l'accès à YouTube est bloqué par le proxy réseau de
l'environnement de travail, et l'identifiant ne ressort pas en recherche. Cette
étude s'appuie donc sur les mécaniques publiquement documentées de ces deux
produits et sur la littérature en design d'attention. **Les points précis de la
vidéo restent à intégrer** — transmettre le titre, la chaîne ou un résumé
permettra de reprendre les sections 2, 3 et 6.

---

## 1. Le problème est mal posé

La question par défaut d'une app de randonnée est : *comment faire revenir
l'utilisateur tous les jours ?*

C'est la mauvaise question, pour une raison mécanique : **on ne randonne pas
tous les jours.** La fréquence réelle est de 1 à 4 sorties par mois, concentrées
sur 6 mois de l'année. Une app qui vise le DAU dans ce contexte n'a que trois
leviers, et ils sont tous mauvais :

1. transformer la randonnée en réseau social (Strava : on scrolle les sorties
   des autres au lieu de faire la sienne) ;
2. ajouter des boucles de jeu détachées de la marche (badges, défis, séries) ;
3. pousser des notifications sans contexte.

Les trois produisent la même chose : **du temps d'écran qui remplace la
sortie**, pas qui la prépare. C'est exactement le mécanisme de dépendance que
l'on veut éviter — et c'est un échec produit, pas seulement un problème moral :
un utilisateur qui scrolle les randos des autres ne réserve pas de randonnée
guidée.

**Reformulation retenue :**

> Comment faire en sorte que, dans 6 semaines, la personne soit **dehors** — et
> que Camins soit la raison pour laquelle elle y est ?

Ce n'est pas de la rétention d'écran, c'est de la **rétention de pratique**.
Toute la suite en découle.

---

## 2. Les quatre leviers, et lesquels sont toxiques

Toute rétention repose sur un mélange de quatre leviers. Trois sont sains, un
seul produit la dépendance.

| Levier | Mécanisme | Toxicité | Décision |
|---|---|---|---|
| **Rendez-vous** | Un moment attendu, à heure connue | Faible — l'attente est bornée | ✅ Levier principal |
| **Investissement** | Ce qu'on a construit et qu'on ne veut pas perdre (collection, carnet) | Faible si la valeur est réelle et exportable | ✅ Levier secondaire |
| **Lien social** | Des gens précis qui attendent quelque chose de vous | Faible en petit groupe, fort en audience | ✅ Uniquement en petit groupe |
| **Récompense variable** | Renforcement intermittent : on ne sait pas ce qu'on va trouver en ouvrant | **Élevée** — c'est le moteur des machines à sous et du feed infini | ⚠️ Autorisé **uniquement** derrière un effort physique |

La récompense variable n'est pas interdite chez Camins : elle est **déplacée**.
Elle ne se déclenche jamais à l'ouverture de l'app, seulement au bout d'un
kilomètre de marche. C'est la même chimie, branchée sur un autre comportement.

---

## 3. Ce qu'on prend à Instagram — et ce qu'on refuse

| Code Instagram | Pourquoi ça marche | Ce qu'on en fait chez Camins | Ce qu'on refuse |
|---|---|---|---|
| **Format Stories** (vertical, plein écran, tap, 15–90 s) | Grammaire visuelle universelle, zéro friction cognitive | L'**Éclat** : récit historique de 60–120 s, vertical, audio dominant | L'éphémère. Un Éclat gagné est gardé à vie. |
| **Feed** | Découverte sans effort | ❌ Aucun feed. L'accueil est une **carte**, pas une file. | Le scroll infini. Le contenu de l'accueil est fini et daté. |
| **Close Friends** | L'intimité produit plus d'engagement que l'audience | La **Cordée** : 8 personnes maximum, invitation uniquement | Les followers, le public, la portée |
| **Réactions rapides** | Feedback social à coût nul | Réactions sur les récits de la Cordée uniquement | Le compteur de likes visible |
| **Stories à la une / archives** | Fierté rétrospective | Le **Cabinet** : la collection d'Éclats, consultable hors-ligne, exportable en PDF | — |
| **Séries (streaks)** | Peur de perdre = puissant | ❌ **Refusé.** Voir §5.1 | La série quotidienne qui punit. C'est la mécanique la plus toxique du lot. |
| **Notifications d'appât** (« X a vu votre profil ») | Curiosité sociale | ❌ Refusé intégralement | Toute notification dont le contenu n'est pas l'information elle-même |
| **Compteurs publics** | Comparaison sociale | ❌ Refusé. Kilomètres et dénivelés restent privés par défaut | Le classement. Camins n'a pas de leaderboard. |

**La ligne de partage est simple :** on emprunte à Instagram sa *grammaire*
(format, rythme, intimité) et on refuse son *économie* (audience, comparaison,
scroll, peur de manquer).

---

## 4. Ce qu'on prend à Whatnot — les petits détails d'attention

Whatnot est un produit de vente en direct. L'essentiel de sa rétention ne vient
pas du catalogue mais d'une somme de micro-attentions pendant le live. C'est
précisément la matière à transposer.

### 4.1 Les détails, un par un

| Détail Whatnot | L'effet réel | Transposition Camins | Risque | Garde-fou |
|---|---|---|---|---|
| **Show à heure fixe**, annoncé à l'avance | Crée un rendez-vous, pas une habitude compulsive | **La Veillée** : jeudi 21h, 40 min, toujours | Aucun majeur | Durée plafonnée, rediffusion permanente |
| **L'hôte vous nomme à voix haute** | Reconnaissance individuelle — l'attention la plus rare et la moins chère | L'hôte cite les marcheurs ayant terminé un Récit dans la semaine | Course à la citation | Tirage parmi les éligibles, jamais les « meilleurs » |
| **Giveaways / sweeps** | Récompense variable partagée, moment collectif | 3 cartes-témoins offertes par Veillée, par tirage | Devient la seule raison de venir | Plafonné, annoncé à l'avance, jamais en fin d'émission pour retenir |
| **Drops limités** (« 12 pièces, c'est tout ») | Rareté réelle, décision immédiate | 8–20 places de randonnée guidée réelle, libérées en direct | Achat sous pression | **Pas d'enchère** : prix fixe, tirage si sur-demande, 24 h de rétractation |
| **Compte à rebours** | Focalise l'attention | Utilisé uniquement pour l'ouverture du live | Anxiété | Jamais de compte à rebours sur une récompense qu'on peut « perdre » |
| **Chat basse latence** | Le direct est vivant, on est vu | Chat de la Veillée, questions à l'hôte | Modération, dérives | Modéré, fermé après le live |
| **Sound design & haptique** (le « ding » de la vente) | Ancre la mémoire, procure une satisfaction physique | Un son unique au déverrouillage d'un Éclat **sur le sentier**, discret, désactivable | Conditionnement | Le son n'existe que dehors, jamais dans les écrans de navigation |
| **La file d'attente** (« vous êtes le prochain ») | Anticipation, statut temporaire | File pour poser sa question en direct | Attente artificielle | Position réelle, temps estimé affiché |
| **Le rituel d'ouverture** (breaks, déballage) | La lenteur crée la valeur | L'hôte ouvre une boîte d'archives en direct et lit le document | — | — |
| **Restock / notification de retour** | Rappel utile | « Le sentier de Gavarnie rouvre le 12 mai » | Prétexte à notifier | Uniquement sur demande explicite, par sentier |
| **Le vendeur a un visage** | Fidélité à une personne, pas à un algorithme | Chaque Éclat et chaque Veillée est signé d'un nom et d'un visage | — | — |

### 4.2 Ce qu'on refuse à Whatnot

- **L'enchère.** Elle transforme l'attention en dépense sous pression et
  fabrique le regret. Prix fixe et tirage au sort à la place.
- **Le live permanent.** Whatnot vit du fait qu'il y a *toujours* un show. Une
  Veillée par semaine, point.
- **Le « mystery box ».** Payer pour un contenu inconnu, c'est du jeu d'argent
  déguisé. Toute carte-témoin est décrite avant d'être obtenue.
- **La relance d'achat.** Aucune notification commerciale hors annonce de la
  Veillée.

**La transposition tient en une phrase :** Whatnot vend des objets rares en
direct ; Camins **vend des places pour marcher** en direct. Le produit vendu
sort la personne de chez elle, ce qui aligne le modèle économique et l'éthique
au lieu de les opposer.

---

## 5. Le système Camins : trois boucles

### Boucle courte — *sur le sentier* (durée : une sortie)

```
marcher → approcher une station → le téléphone vibre une fois
       → l'Éclat se lance dans l'oreille → l'objet entre au Cabinet
       → il reste 3 stations sur ce Récit → marcher
```

C'est ici, et seulement ici, qu'agit la récompense variable : on ne sait pas
si la prochaine station cache un témoignage, une photo de 1912 ou une carte
militaire. **La chimie de l'imprévu est branchée sur les jambes, pas sur le
pouce.**

### Boucle moyenne — *la semaine* (durée : 7 jours)

```
dimanche : Récit terminé → mardi : l'Éclat bonus du Récit arrive
       → jeudi 21h : la Veillée, l'hôte cite le Récit, un drop de places
       → vendredi : la Cordée voit ce que vous avez rapporté
       → samedi : la sortie suivante est planifiée dans l'app
```

Un seul rendez-vous, deux notifications, aucun scroll.

### Boucle longue — *le Cycle* (durée : 3 mois)

```
Cycle I : 4 Récits dans 4 départements → 1 carte-témoin par Récit
       → Cycle complet → carnet papier imprimé et envoyé
       → Cycle II s'ouvre, thème différent, territoires différents
```

Le Cycle donne une raison de revenir en **octobre** à quelqu'un qui a marché en
**juillet** — l'horizon de rétention pertinent pour ce produit. Et il se termine
par un **objet physique**, hors de l'app : la fin de la boucle est un livre, pas
un écran.

### 5.1 Pourquoi pas de série quotidienne (« streak »)

C'est la mécanique la plus efficace du marché et la plus toxique. Elle produit :

- de la **culpabilité** (on ouvre l'app par peur, pas par envie) ;
- des **comportements de contournement** (ouvrir l'app sans marcher) ;
- et surtout, appliquée à la randonnée, un **risque physique** : marcher pour ne
  pas casser une série, c'est marcher fatigué, en retard, par mauvais temps.

**Remplacement :** la **Saison**. On progresse dans un Cycle à son rythme sur
3 mois ; une sortie vaut autant qu'elle soit la première ou la dixième ; aucun
compteur ne se remet à zéro ; un Cycle non terminé reste ouvert et se termine
l'année suivante.

---

## 6. Le risque de dépendance, ici, concrètement

Il faut nommer les dangers propres à ce produit, pas ceux des réseaux sociaux en
général.

### 6.1 Le danger classique — la substitution
L'app devient un objet de consommation à la place de la randonnée : on regarde
des Éclats, on suit les Cordées, on ne sort plus. **Neutralisé par construction**
par la règle d'or (§3 du document produit) : il n'y a presque rien à consommer
assis. C'est le choix de design le plus important du produit.

### 6.2 Le danger spécifique — la gamification tue en montagne
C'est le risque le plus grave et le moins discuté. Une collection à compléter +
une rareté temporelle + un massif à 2 784 m = des gens qui montent **par mauvais
temps, trop tard, mal équipés**, pour ne pas rater un Éclat.

Règles de conception qui en découlent, non négociables :

1. **Aucun Éclat n'est limité dans le temps.** Rien ne disparaît jamais.
2. **Aucune récompense de vitesse, de série, de « premier arrivé ».**
3. **Fermeture météo automatique** : au-dessus d'un seuil d'alerte Météo-France
   sur la zone, les stations concernées sont masquées et le Récit est suspendu,
   pas « en jeu ».
4. **Fermeture saisonnière** : les stations en haute montagne sont fermées hors
   période, sans compensation ni rattrapage — l'absence de rattrapage est
   volontaire : le rattrapage crée la pression.
5. **Aucune trace en direct partagée** : on ne peut pas voir qu'un ami est en
   train de monter. Pas de course involontaire.

### 6.3 Le danger territorial — la sur-fréquentation
Envoyer 5 000 personnes sur une lavogne du Larzac ou un site fragile la détruit.

- Jauge par station : au-delà d'un seuil de passages/jour, la station n'est plus
  mise en avant et les nouveaux Récits orientent ailleurs.
- Les sites les plus fragiles ne reçoivent **jamais** d'Éclat : on raconte
  l'histoire depuis un point de vue voisin.
- Validation des tracés avec les parcs naturels régionaux et l'ONF avant
  publication.

### 6.4 Le danger de la donnée
Une trace GPS de randonnée est une donnée personnelle sensible (domicile, rythme
de vie, santé). Traces privées par défaut, floutage des 500 premiers mètres,
aucune revente, export et suppression en deux taps, hébergement européen.

---

## 7. La charte « Sentier d'abord » — 10 règles testables

Chaque règle est écrite pour pouvoir être **vérifiée** par un tiers dans l'app.

1. **Aucune publicité, aucune revente de données.** Le temps d'écran n'a aucune
   valeur pour nous.
2. **Pas de fil infini.** Tout écran de l'app a une fin visible, avec la mention
   *« C'est tout pour aujourd'hui. »*
3. **Maximum 2 notifications par semaine**, sauf sécurité. Réglable à 0.
   Contenu utile dans la notification elle-même — jamais d'appât.
4. **Pas de série, pas de classement, pas de compteur public.**
5. **Rien ne se perd.** Aucun contenu limité dans le temps, aucune récompense
   qui expire.
6. **Le mode Sentier est l'état par défaut en randonnée** : écran noir, audio
   seul.
7. **Le compteur de temps d'écran est affiché dans l'app**, et la baisse est
   présentée comme un succès.
8. **Aucune enchère, aucun contenu à obtention aléatoire payante.**
9. **La météo et la saison ferment des contenus**, et cette fermeture n'est
   jamais rattrapable.
10. **Le Cycle se termine hors de l'app**, par un objet papier.

---

## 8. Métriques : mesurer la bonne chose

### 8.1 North Star inversée — le *Ratio Camins*

```
                heures passées DEHORS attribuées à l'app
Ratio Camins = ───────────────────────────────────────────
                   heures passées DANS l'app
```

Cible : **> 8**. Un ratio qui baisse est une alerte produit, même si
l'engagement monte. C'est la seule métrique qui rend la charte contraignante :
un feed infini ferait monter le DAU et **effondrerait** le Ratio.

### 8.2 Métriques de succès

| Métrique | Cible V1 | Pourquoi |
|---|---|---|
| Sorties réelles / utilisateur actif / mois | ≥ 1,5 | La pratique, pas l'usage |
| Récits terminés (dehors) / mois | ≥ 0,8 | Le récit atteint sa fin |
| Rétention à 6 mois (a fait ≥ 1 sortie) | ≥ 35 % | Horizon saisonnier, pas quotidien |
| Taux de conversion Veillée → réservation | ≥ 4 % | Le modèle économique tient |
| Session médiane hors sentier | **≤ 4 min** | Une cible qu'on cherche à faire *baisser* |

### 8.3 Anti-métriques — les seuils d'alerte

Ces chiffres déclenchent une revue produit **quand ils montent** :

| Signal | Seuil d'alerte | Ce que ça révèle |
|---|---|---|
| Temps d'écran hors randonnée | > 6 min/jour | L'app devient consommable au canapé |
| Ouvertures quotidiennes | > 3/jour | On a fabriqué une compulsion |
| Ouvertures sans sortie dans les 14 jours suivants | > 60 % | L'app remplace la marche |
| Sorties démarrées en alerte météo | > 0,5 % | **Urgence sécurité** |
| Passages/jour sur une station sensible | seuil site par site | Sur-fréquentation |
| Désactivation du mode Sentier | > 30 % | Le design échoue, pas les gens |

---

## 9. Ce qui peut échouer

1. **La règle d'or freine l'acquisition.** On ne peut pas essayer le produit
   sans sortir. *Atténuation :* la première Veillée et 3 Éclats « seuil »
   (accessibles au départ du sentier, sur le parking) sont ouverts à tous.
2. **La Veillée dépend d'un hôte charismatique.** Risque de personne-clé.
   *Atténuation :* rotation de 4 hôtes dès la V1.
3. **La rétention saisonnière est difficile à financer.** Les revenus sont
   concentrés d'avril à octobre. *Atténuation :* Cycle d'hiver en basse altitude
   (Corbières, Camargue gardoise, garrigue) et abonnement annuel.
4. **La charte est un handicap concurrentiel court terme.** Un concurrent sans
   scrupules fera de meilleurs chiffres d'engagement. *À assumer :* c'est la
   marque. La charte est publiée et opposable.
5. **Le contenu est le vrai coût.** 91 Éclats sourcés, c'est un métier
   d'éditeur, pas une feature. Si cette ligne budgétaire saute, le produit
   devient un AllTrails moins bon.

---

## 10. Protocole de validation

| Phase | Durée | Question testée | Critère de sortie |
|---|---|---|---|
| **P0 — Papier** | 2 sem. | Le récit géolocalisé change-t-il l'expérience ? | 15 marcheurs testent 1 Récit avec un lecteur audio manuel |
| **P1 — Un sentier** | 6 sem. | Le déverrouillage GPS fonctionne-t-il sur le terrain (réseau, précision, batterie) ? | 80 % de déverrouillages réussis, < 12 %/h de batterie |
| **P2 — Une Veillée** | 4 sem. | Le live convertit-il en réservation ? | ≥ 4 % de conversion sur 4 Veillées |
| **P3 — Un Cycle** | 3 mois | La boucle longue tient-elle ? | ≥ 30 % des inscrits terminent ≥ 2 Récits |

---

## Synthèse en une page

**On garde d'Instagram** : le format vertical court, l'intimité du petit groupe,
la fierté de l'archive personnelle.
**On garde de Whatnot** : le rendez-vous à heure fixe, l'hôte qui vous nomme, la
rareté honnête, le son qui récompense, le direct qui fait exister.
**On refuse des deux** : le fil infini, la série, le classement, l'enchère, la
notification-appât, la publicité.
**On ajoute** : la règle d'or — *la récompense est dehors*.

Le pari : une app dont on se sert **quatre minutes** avant de partir et **quatre
heures** en marchant est plus rentable, et infiniment plus défendable, qu'une app
dont on se sert quarante minutes par jour assis.
