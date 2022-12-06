import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE)

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */

const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;

    await connection.exec(
        `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY,
            id_type_utilisateur INTEGER NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS tournoi(
            id_tournoi INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            capacite INTEGER NOT NULL,
            date_debut INTEGER NOT NULL
           
        );
        
        
        CREATE TABLE IF NOT EXISTS tournoi_utilisateur(
            id_tournoi INTEGER,
            id_utilisateur INTEGER,
            PRIMARY KEY (id_tournoi, id_utilisateur),
            CONSTRAINT fk_tournoi_utilisateur 
                FOREIGN KEY (id_tournoi)
                REFERENCES tournoi(id_tournoi) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_utilisateur_tournoi 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
            
        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('administrateur');

            
        
        
            INSERT INTO tournoi (nom, description,capacite,date_debut) VALUES 
            
            ('Tournoi Destiny 2', 'Une compétion 3v3 Destiny 2.', 6, 1662681600000),
            ('Tournoi Overwatch', 'Le premier à deux victoires gagne.', 10, 1662465600000),
            ('Tournoi R6', 'Le premier à trois victoires gagne.', 10, 1662418800000),
            ('Tournoi EFT', 'Le premier qui extract de labs gagne', 16, 1667257200000),
            ('Tournoi Wizard', 'Une compétition simple de PvP Wizard.', 20, 1661522400000),
            ('Tournoi Overwatch 2', 'Le premier à deux victoires gagne.', 10, 1662465600000);
            
            INSERT INTO tournoi_utilisateur (id_tournoi, id_utilisateur) VALUES 
            (1, 2),
            (2, 2),
            (3, 2),
            (4, 2),
            (5, 2),
            (6, 2);
        `
    );

    return connection;
}

// Base de données dans un fichier
let connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;