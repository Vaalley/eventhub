# MPD Merise - EventHub

CREATE TABLE Utilisateur(
   id INT,
   email VARCHAR(200),
   password VARCHAR(255),
   nom VARCHAR(50),
   prenom VARCHAR(50),
   role VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE Lieu(
   id INT,
   nom VARCHAR(50),
   adresse VARCHAR(50),
   capacite INT,
   PRIMARY KEY(id)
);

CREATE TABLE Categorie(
   id INT,
   nom VARCHAR(50),
   description VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE Evenement(
   id INT,
   titre VARCHAR(50),
   description VARCHAR(50),
   date_debut DATETIME,
   date_fin DATETIME,
   statut VARCHAR(50),
   capacite_max INT,
   id_1 INT NOT NULL,
   id_2 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES Categorie(id),
   FOREIGN KEY(id_2) REFERENCES Lieu(id)
);

CREATE TABLE TypeBillet(
   id INT,
   nom VARCHAR(50),
   prix CURRENCY,
   quantite_dispo INT,
   id_1 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES Evenement(id)
);

CREATE TABLE Reservation(
   id INT,
   date_reservation DATETIME,
   statut VARCHAR(50),
   montant_total CURRENCY,
   id_1 INT NOT NULL,
   id_2 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES Evenement(id),
   FOREIGN KEY(id_2) REFERENCES Utilisateur(id)
);

CREATE TABLE Billet(
   id INT,
   code_qr ,
   est_utilise LOGICAL,
   id_1 INT NOT NULL,
   id_2 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES TypeBillet(id),
   FOREIGN KEY(id_2) REFERENCES Reservation(id)
);

CREATE TABLE Avis(
   id INT,
   note INT,
   commentaire VARCHAR(200),
   id_1 INT NOT NULL,
   id_2 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES Evenement(id),
   FOREIGN KEY(id_2) REFERENCES Utilisateur(id)
);

CREATE TABLE Paiement(
   id INT,
   montant CURRENCY,
   moyen_paiement VARCHAR(50),
   statut VARCHAR(50),
   id_1 INT NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(id_1),
   FOREIGN KEY(id_1) REFERENCES Reservation(id)
);
