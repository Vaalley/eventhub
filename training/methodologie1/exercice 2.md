# EventHub - Cartographie des acteurs

Énoncé :
Identifiez tous les acteurs (internes et externes) qui interagissent avec la plateforme EventHub. Classez-les par type et définissez leur rôle principal.

## Réponse

### Acteurs principaux (internes)

| Acteur | Rôle principal |
| --- | --- |
| Participant | Utilisateur qui explore les événements et réserve des places. |
| Organisateur | Personne ou entreprise qui crée, publie et gère les événements. |
| Administrateur | Gestionnaire de la plateforme qui supervise les opérations et modère les contenus. |

### Acteurs secondaires (externes)

| Acteur | Rôle principal |
| --- | --- |
| Système de paiement (Stripe) | Traite les transactions financières de manière sécurisée. |
| Service email | Envoie les notifications, confirmations et rappels. |
| Service de cartographie | Affiche la localisation des lieux d'événements. |
| Système de stockage | Héberge les images, documents et fichiers liés aux événements. |
| Service d'analytics | Collecte et analyse les données d'utilisation et de performance. |
| Système de notification | Gère les alertes et messages en temps réel. |
| Générateur de QR code | Produit les billets électroniques pour l'accès aux événements. |
| Service de cache | Optimise les performances en stockant temporairement les données fréquemment consultées. |
