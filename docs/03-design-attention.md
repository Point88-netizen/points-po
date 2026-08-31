# Étude de design — jouer sur l'attention, sans la voler

> Troisième document Camins. Le [document 02](02-retention-ethique.md) traite du
> **système** : les boucles, les rendez-vous, les métriques. Celui-ci traite du
> **métier** : ce qui, seconde par seconde, attrape un regard — le mouvement, le
> son, le contraste, la durée, les mots.

---

## 0. La ligne

Toute interface joue sur l'attention. Un bouton rouge joue sur l'attention. Ce
n'est pas la question. La question est de savoir **de quel côté de la ligne** on
se place, et cette ligne est identifiable par un test.

### Le test en trois questions

Pour chaque élément d'interface qui appelle le regard :

1. **Le test du consentement descriptible.**
   Si on décrivait ce moment à la personne *avant*, l'accepterait-elle ?
   *« Jeudi à 21h, un guide raconte une histoire pendant 40 minutes »* : oui.
   *« Chaque fois que vous ouvrez l'app, un contenu différent vous attend pour
   que vous reveniez »* : non.

2. **Le test de la livraison.**
   L'élément **apporte-t-il** l'information, ou la **promet-il** ?
   « Le sentier de Gavarnie rouvre le 12 mai » apporte. « Une nouveauté vous
   attend » promet. Une promesse crée une dette d'attention que l'interface
   encaisse et ne rembourse pas.

3. **Le test de l'explication.** *(le plus discriminant)*
   L'effet survit-il à sa propre explication ?
   Le rendez-vous du jeudi fonctionne mieux quand on le comprend. Le compteur de
   série ne fonctionne **que** tant qu'on ne voit pas qu'on est en train d'être
   tenu par lui.

> **Un mécanisme qui échoue à la question 3 n'est pas un design d'attention,
> c'est un tour de passe-passe.** Il n'a d'effet que tant qu'il reste invisible,
> donc il traite l'utilisateur comme un sujet et non comme un client.

Toute la suite est l'application de ce test à chaque canal perceptif.

---

## 1. Le budget d'attention

On ne conçoit pas des écrans, on **dépense un budget**. Camins déclare le sien,
par semaine et par personne :

| Moment | Attention demandée | Nature |
|---|---|---|
| Préparation d'une sortie | 2 × 4 min | Consultée, volontaire |
| Notifications | 2 × 3 s | Interruption — le poste le plus cher |
| Sur le sentier | **0 min d'écran**, ~7 min d'audio | Superposée à la marche |
| La Veillée | 40 min | Consentie à l'avance, à heure dite |
| **Total** | **≈ 55 min / semaine** | |

Ce tableau est un **outil de décision**, pas une communication. Toute
fonctionnalité nouvelle doit déclarer ce qu'elle prend et à quel poste. Une
fonctionnalité qui augmente le budget doit dire ce qu'elle finance et ce qu'elle
remplace.

**Le poste le plus cher n'est pas le plus long.** Six secondes de notification
hebdomadaire coûtent plus qu'une Veillée de quarante minutes : la Veillée a été
acceptée, la notification est arrachée à autre chose.

---

## 2. La hiérarchie — la règle du seul accent

**Si deux éléments crient, aucun ne parle.**

Chaque écran a droit à **un** point d'attention primaire. Il est déclaré à la
conception, et le test des 5 secondes (§8) le vérifie.

| Écran | L'accent, et rien d'autre |
|---|---|
| Sentiers | La carte |
| Fiche Récit | Le bouton *Démarrer le mode Sentier* |
| Mode Sentier | Le kilomètre |
| Éclat | Le titre du récit |
| Veillée | Le direct |
| Cabinet | Le Ratio Camins |

### Le budget de contraste

La couleur est une ressource rare, dépensée par règle :

- **Rouge catalan** `#C8201A` — une action engageante par écran, plus les
  éléments de sécurité. Jamais décoratif, jamais deux fois sur le même écran.
- **Vert** `#1E6B1A` — l'état acquis (Éclat obtenu, condition remplie).
  Une confirmation, jamais un appel.
- **Jaune** `#F5D800` — **n'existe que dans l'instant de déverrouillage.**
  Interdit partout ailleurs dans l'app. C'est la seule couleur que l'œil
  n'apprend jamais à ignorer, parce qu'elle ne se montre que sept fois par
  sortie.
- **Or** `#C49A3C` — les objets de collection. Sourd, jamais lumineux.
- Tout le reste vit en encre sur papier.

Une couleur qu'on voit partout cesse d'être vue. La rareté d'usage **est** la
technique.

---

## 3. Le temps — six rythmes, et rien entre les deux

L'attention a des durées propres. Camins n'en utilise que six, et toute durée de
l'interface doit pouvoir dire laquelle elle sert.

| Durée | Ce qu'elle est | Pourquoi celle-là |
|---|---|---|
| **90 ms** | Réponse au toucher | Sous ce seuil, l'action est perçue comme instantanée |
| **320 ms** | Transition d'état | Assez pour suivre un objet du regard, pas assez pour attendre |
| **45 s** | Condition de présence sur une station | Exclut le passage en voiture, ne punit pas le marcheur |
| **90 s** | Un Éclat | Durée d'écoute tenable en marchant avant que le pied ne reprenne le dessus |
| **40 min** | La Veillée | Limite haute d'une attention volontaire assise — un épisode |
| **3 mois** | Un Cycle | Une saison |

**Aucune durée intermédiaire arbitraire.** Un chargement de 600 ms, une
animation de 500 ms, un délai de 2 s « pour faire joli » sont des dépenses non
déclarées.

---

## 4. Le mouvement — le canal le plus cher

Le mouvement périphérique déclenche un réflexe d'orientation : **l'œil y va
avant que la personne n'ait décidé.** C'est le seul canal visuel qui contourne
l'arbitrage. Donc il est rationné.

**Les quatre règles :**

1. **Le mouvement n'explique qu'un changement d'état** — d'où vient cet objet,
   où il va. Jamais une décoration, jamais une « ambiance ».
2. **Rien ne bouge tant que la personne n'a rien fait**, à une exception près :
   le direct.
3. **On entre lentement, on sort vite.** Entrée : 320 ms,
   `cubic-bezier(.2,.8,.3,1)` — l'objet arrive et se pose. Sortie : 180 ms,
   linéaire — un objet qui part n'a pas besoin d'être regardé partir. La
   dissymétrie est le détail qui fait qu'une interface paraît « soignée » sans
   qu'on sache pourquoi.
4. **Un seul clignotement dans toute l'application** : le point du direct,
   1,1 s. Il porte une information vraie et périssable. Tout autre clignotement
   est un appel sans contenu.

`prefers-reduced-motion` ne coupe pas seulement les transitions décoratives :
il ramène tout aux changements d'opacité, y compris le point du direct, qui
devient un point plein.

---

## 5. Le son et l'haptique

C'est le canal où la frontière entre attention gagnée et attention captée est la
plus fine — et le plus efficace des deux côtés.

### Cahier des charges du son de déverrouillage

| Paramètre | Valeur | Raison |
|---|---|---|
| Forme | Deux notes, quinte montante | Reconnaissable en une fois, non impératif |
| Durée | 340 ms | Assez court pour ne pas couvrir un pas |
| Attaque | 12 ms | Pas de percussion : ne sursaute pas |
| Niveau | −18 dBFS | Audible dans un écouteur sous le vent, pas dominant |
| **Escalade** | **aucune** | Le son du 40ᵉ Éclat est identique à celui du 1ᵉʳ |
| Portée | **Sur le sentier uniquement** | Empêche le conditionnement de l'ouverture |

**L'escalade est la ligne.** Le son d'une machine à sous monte à chaque
occurrence — c'est exactement ce qui crée la recherche, parce que le cerveau
apprend qu'il existe un « plus » à obtenir. Un son constant récompense ; un son
qui monte fabrique un manque.

### Haptique

Une impulsion, 35 ms, jamais de motif répété. La vibration dit *« c'est
arrivé »*, jamais *« reviens »*.

---

## 6. Le vide — le geste le plus fort du produit est un écran noir

Le mode Sentier retire l'interface pendant les quatre heures où la personne est
avec le produit. C'est contre-intuitif pour un designer : on efface son propre
travail au moment de plus forte présence.

C'est pourtant là que le produit dit ce qu'il est.

Détail d'exécution : **l'écran noir n'est pas une veille.** Il affiche trois
informations en très basse luminosité — kilomètre, prochaine station, batterie —
lisibles à bout de bras au soleil, sans jamais appeler le regard. La différence
entre « éteint » et « disponible sans réclamer » est tout le sujet.

### Concevoir pour la fatigue

Le randonneur n'est pas un utilisateur de bureau : soleil rasant, écran sale,
gants, main qui tremble, batterie basse, une seule main libre.

- Contraste ≥ 7:1 sur tout élément fonctionnel.
- Cibles tactiles ≥ 48 px, atteignables au pouce d'une seule main.
- **Aucun geste de précision demandé en marchant** — pas de glissement fin, pas
  de curseur, pas de double-tap.
- Aucune décision irréversible accessible sans un second geste.

---

## 7. Les mots — la copie est un canal d'attention

### Règles de notification

1. **L'information est dans la notification.** « Le sentier de Gavarnie rouvre
   le 12 mai » — pas « Une nouveauté vous attend ».
2. **Aucun compteur, aucune accusation.** Jamais « Vous avez 3 Récits en
   attente ». Un compteur non sollicité est une dette qu'on n'a pas contractée.
3. **Aucune optimisation d'horaire.** La Veillée est annoncée une fois, à 20h30.
   On n'envoie pas au moment où les gens cliquent le plus.
4. **Si elle ne tient pas en entier sur l'écran verrouillé, elle n'est pas
   envoyée.** Une notification tronquée est une promesse par construction.

### Règles de libellé

- Un bouton dit ce qui va se passer, et le message qui suit le confirme avec le
  même mot : *Démarrer le mode Sentier* → *Mode Sentier démarré*.
- On nomme les choses comme le marcheur les nomme : *sentier*, *station*,
  *sortie* — jamais *contenu*, *item*, *parcours géolocalisé*.
- Les chiffres sont donnés avec leur unité et leur échelle : *59 m*, pas *0,059*.

---

## 8. Les micro-attentions — la transposition Whatnot, au niveau du geste

Le [document 02](02-retention-ethique.md) traite de ces mécaniques au niveau du
système. Voici leur exécution.

| Micro-attention | Exécution | La contrainte qui la garde honnête |
|---|---|---|
| **Nommer quelqu'un** | L'hôte prononce le nom à voix haute | Nommer **sans classer** : tirage parmi les éligibles, jamais un palmarès |
| **L'accusé de réception** | Toute action a une conséquence visible en < 100 ms | Rien ne part dans le vide, y compris les actions qui échouent |
| **Le compte à rebours** | Vers l'ouverture du live, vers la fermeture du tirage | **Jamais vers la perte d'une chose déjà possédée** |
| **La file d'attente** | Position réelle et temps estimé affichés | Une file fausse détruit plus de confiance qu'elle n'en gagne |
| **L'attente habitée** | Pendant un téléchargement de carte : ce qui se télécharge, nommé | Jamais un indicateur qui tourne sans information |
| **Le rituel** | L'hôte ouvre une boîte d'archives en direct, lentement | La lenteur est le contenu, pas un délai |

---

## 9. Ce qu'on refuse, au niveau du geste

Ces éléments échouent au test de l'explication. Ils sont interdits par la charte
technique, pas seulement déconseillés.

| Motif | Ce qu'il fait réellement |
|---|---|
| Pastille rouge non sollicitée sur l'icône | Crée une tâche que la personne n'a pas acceptée |
| *Tirer pour rafraîchir* sur un contenu fini | Simule une machine à sous sur un contenu qui n'a pas changé |
| Lecture automatique du suivant | Retire la décision de continuer |
| Défilement infini | Supprime le point d'arrêt naturel |
| Squelettes de chargement plus nombreux que le contenu réel | Ment sur ce qui arrive |
| « 47 personnes regardent ce sentier » | Fabrique une urgence sociale fausse — et, en montagne, dangereuse |
| Animation d'ouverture de récompense de plus de 400 ms | Étire artificiellement l'anticipation |
| Son ou badge qui s'intensifie avec la répétition | Fabrique un manque |

---

## 10. Comment on vérifie

Cinq protocoles, applicables par quelqu'un qui n'a pas conçu l'écran.

1. **Test des 5 secondes.** On montre l'écran 5 secondes, on demande ce qu'on a
   vu en premier. Si ce n'est pas l'accent déclaré au §2, l'écran est raté — pas
   le testeur.
2. **Test du soleil.** Luminosité à 100 %, écran gras, dehors à midi. Tout
   élément fonctionnel illisible est un défaut bloquant.
3. **Test de l'explication.** On décrit le mécanisme à l'utilisateur. S'il perd
   son effet une fois expliqué, il sort du produit.
4. **Test du budget.** Toute fonctionnalité nouvelle déclare le temps d'attention
   qu'elle demande et à quel poste du §1.
5. **Audit de dette d'attention** — trimestriel. Inventaire exhaustif de tout ce
   qui, dans l'app, **bouge, sonne, vibre, clignote ou notifie**. Chaque entrée
   doit citer l'information qu'elle porte. Ce qui ne peut pas la citer est
   supprimé dans la version suivante.

L'audit trimestriel est le seul de ces protocoles qui coûte cher. C'est aussi
le seul qui empêche la dérive : une interface ne devient pas prédatrice d'un
coup, elle le devient par accumulation de petites additions dont chacune se
justifiait.

---

## Synthèse

**Jouer sur l'attention, c'est un métier ; la voler, c'est un modèle
économique.** La différence n'est pas dans les techniques — mouvement, son,
couleur, rareté, nomination sont les mêmes des deux côtés — mais dans trois
contraintes :

1. La technique est **déclarée** (le budget du §1).
2. Elle **livre** au lieu de promettre (§7).
3. Elle **survit à son explication** (§0).

Camins dépense une couleur pour un seul instant, un son sans escalade, un
clignotement pour une seule information, et quatre heures d'écran noir. C'est
un design d'attention. Ce n'en est pas moins un design *contre* la captation —
ce sont les mêmes outils, tenus par des règles écrites.
