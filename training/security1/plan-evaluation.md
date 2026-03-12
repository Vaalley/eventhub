# Plan Evaluation pour étudiants

<aside>
📌

Après avoir travaillé sur la mise en place du système de double authentification
sur le projet fil rouge EventHub, vous allez préparer une présentation sur
laquelle vous serez noté. Cette présentation devra durer environ 15 minutes.Vous
créerez un accès via un tunnel et donnerez le lien à votre évaluateur afin que
celui-ci puisse tester en même temps :

> ssh -t -R 80:localhost:<port_projet>[proxy.tunnl.gg](http://proxy.tunnl.gg/)

</aside>

Voici un exemple de plan de soutenance :

**1. Introduction**

- Votre présentation
- Le contexte et l'expression des besoins

**2. Développement**

- Implémentation du QR Code pour la configuration de l'OTP
- Mise en place du système de Recovery codes

**3. Front**

- Présentation de l'UX choisie et mise en place
- Cohérence de l'UX avec l'existant

**4. Sécurité appliquée**

- Les bonnes pratiques MFA
- Les recovery codes sont hashés
- Les recovery codes sont supprimés
- Présentation du mécanisme de limitation de tentatives
- Accès refusé si les conditions ne sont pas remplies

**5. Documentation technique**

- Enrichissement de la documentation technique suite à l'ajout de la
  fonctionnalité

**6. Conclusion**

- Compétences acquises
- Difficultés rencontrées
- Points d'amélioration
