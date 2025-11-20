# MLD Merise - EventHub

Utilisateur = (id INT, email VARCHAR(200), password VARCHAR(255), nom VARCHAR(50), prenom VARCHAR(50), role VARCHAR(50));

Lieu = (id INT, nom VARCHAR(50), adresse VARCHAR(50), capacite INT);

Categorie = (id INT, nom VARCHAR(50), description VARCHAR(50));

Evenement = (id INT, titre VARCHAR(50), description VARCHAR(50), date_debut DATETIME, date_fin DATETIME, statut VARCHAR(50), capacite_max INT, #id_1, #id_2);

TypeBillet = (id INT, nom VARCHAR(50), prix CURRENCY, quantite_dispo INT, #id_1);

Reservation = (id INT, date_reservation DATETIME, statut VARCHAR(50), montant_total CURRENCY, #id_1, #id_2);

Billet = (id INT, code_qr , est_utilise LOGICAL, #id_1, #id_2);

Avis = (id INT, note INT, commentaire VARCHAR(200), #id_1, #id_2);

Paiement = (id INT, montant CURRENCY, moyen_paiement VARCHAR(50), statut VARCHAR(50), #id_1);
