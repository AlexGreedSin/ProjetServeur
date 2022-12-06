import connectionPromise from "./connexion.js";
import { hash } from 'bcrypt';

export const addUtilisateur = async(courrielUser, motPasse, prenomUser, nomUser) => {
    let connection = await connectionPromise;
    
    let motDePasseHash = await hash(motPasse, 10);

    await connection.run(
        `INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES (1,?,?,?,?)`,
        [courrielUser,motDePasseHash,prenomUser,nomUser]
    );
}

export const getUtilisateurByCourriel = async(courrielUser) => {
    let connection = await connectionPromise;

    let utilisateur = await connection.get(
        `SELECT *
        FROM utilisateur 
        WHERE courriel = ?`,
        [courrielUser]  
    );

    return utilisateur;
}

export const getUtilisateur = async(id) => {
    let connection = await connectionPromise;

    let utilisateur = await connection.get(
        `SELECT id_utilisateur FROM utilisateur
        WHERE id_utilisateur=?`,
        [id]
    );

    return utilisateur;
}