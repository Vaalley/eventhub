# Énoncé

On veut simuler le fonctionnement d'une banque.

Une banque a un nom et une liste de clients.

Un client a un nom, prénom, ville et salaire comme propriétés.

Quand une banque ajoute un client à sa liste, cela crée automatiquement son
compte. Un compte a un numéro à 7 chiffres générés aléatoirement et un solde
initial à zéro (sauf si le client ouvre son compte avec un dépôt).

Il peut déposer, retirer et consulter son solde depuis le compte. La banque peut
faire une demande de CB pour le compte d'un client.

La CB a:

16 chiffres générés aléatoirement (au format XXXX XXXX XXXX XXXX) un cvc de 3
chiffres (au format XXX) générés aléatoirement une date d'expiration 5 ans après
la date de création de la CB (au format MM/YY)
