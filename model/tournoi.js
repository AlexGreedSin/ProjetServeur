import connectionPromise from "./connexion.js";
/**
 * @returns Retourne tous les tournois dans la table tournoi
 */
export const getTournoi = async () => {
    let connection = await connectionPromise;

    let resultat = await connection.all(`
        SELECT * FROM tournoi
        `
    );

    return resultat;

}
/**
 * @returns Retourne tous les inscriptions aux tournois
 */
export const getTournoiInscription = async () => {
    let connection = await connectionPromise;

    let resultat = await connection.all('SELECT * FROM tournoi_utilisateur')

    return resultat;
}
/**
 * @returns Retourne tous les tournois auxquels l'utilisateur qui a l'id 1 est inscrits.
 */
export const getTournoiUtilisateur = async (idd) => {
    let connection = await connectionPromise;

    let resultat = await connection.all(
        //Un select sur toutes les informations importantes d'un tournoi, un left join sur la table tournoi_utilisateur qui prend ce que les deux table ont en commun (id_tournoi)
        //where l'id_utilisateur=1
        `SELECT tournoi.id_tournoi, tournoi.nom, tournoi.description, tournoi.capacite,tournoi.date_debut FROM tournoi
        LEFT JOIN tournoi_utilisateur ON tournoi.id_tournoi=tournoi_utilisateur.id_tournoi
        WHERE tournoi_utilisateur.id_utilisateur =?
        GROUP BY tournoi.id_tournoi`,
        [idd])

    return resultat;
}
/**
 * @returns Retourne les inscriptions du participants, dans le fond tous les tournois
 */
export const getFictif = async() => {
    let connection = await connectionPromise;

    let resultat = await connection.all(
        `SELECT * FROM tournoi_utilisateur
        WHERE id_utilisateur = 2`
    )
    return resultat;
}
/**
 * @param {Number} id_tournoi id du tournoi
 * @returns retourne le nombre de personnes qui sont inscrit au tournoi avec l'id 
 */
 export const getCapacite = async () => {
    let connection = await connectionPromise;

    let resultat = await connection.all(
        `SELECT id_tournoi ,COUNT(*) AS nombre_inscrit FROM tournoi_utilisateur
        GROUP BY id_tournoi
        `
    )
    return resultat;
}
/**
 * @param {String} nom Nom du tournoi
 * @param {String} description Description du tournoi
 * @param {Number} capacite Capacite maximale du tournoi
 * @param {Date} date_debut Date de début du tournoi
 * @returns Ajoute un nouveau tournoi dans la base de données et lui donne un id
 */
export const addTournoi = async (nom, description, capacite, date_debut) => {
    let connection = await connectionPromise;

    let resultat = await connection.run(
        `INSERT INTO tournoi (nom, description,capacite,date_debut)
        VALUES (?,?,?,?)`,
        [nom, description, capacite, date_debut]
    );

    return resultat.lastID;
}

/**
 * @param {Number} id_tournoi id du tournoi auquel l'utilisateur 1 veut s'inscrire
 * @returns Ajoute une inscription à un tournoi dans la table tournoi_utilisateur
 */
export const inscrireTournoiUser1 = async (id_tournoi, id_utilisateur) => {
    let connection = await connectionPromise;

    let resultat = await connection.run(
        `INSERT INTO tournoi_utilisateur(id_tournoi, id_utilisateur)
        VALUES (?,?)`,
        [id_tournoi, id_utilisateur]
    );
    return resultat.lastID;
}
/**
 * 
 * @param {Number} id_tournoi id du tournoi auquel l'utilisateur 2 (fictif) veut s'inscrire
 * @returns Ajoute une inscription à un tournoi dans la table tournoi_utilisateur 
 */
export const inscrireTournoiUserFictif = async (id_tournoi) => {
    let connection = await connectionPromise;

    let resultat = await connection.run(
        `INSERT INTO tournoi_utilisateur(id_tournoi, id_utilisateur)
        VALUES (?,2)`,
        [id_tournoi]
    );
    return resultat.lastID;
}

/**
 * @param {Number} id_tournoi Id du tournoi à supprimer de la TABLE tournoi
 */
export const delTournoi = async (id_tournoi) => {
    let connection = await connectionPromise;

    await connection.run(
        `DELETE FROM tournoi
        WHERE id_tournoi = ?
        `,
        [id_tournoi]
    );

}
/**
 * @param {Number} id_tournoi Id du tournoi à supprimer de la TABLE tournoi_utilisateur
 */
export const delTournoiUtilisateur = async (id_tournoi) => {
    let connection = await connectionPromise;

    await connection.run(
        `DELETE FROM tournoi_utilisateur
        WHERE id_tournoi =?`,
        [id_tournoi]
    );
}
/**
 * @param {Number} id_tournoi Id du tournoi à supprimer de la TABLE tournoi_utilisateur
 */
 export const delTournoiUtilisateurS = async (id_tournoi,id_utilisateur) => {
    let connection = await connectionPromise;

    await connection.run(
        `DELETE FROM tournoi_utilisateur
        WHERE id_tournoi =? AND id_utilisateur =?`,
        [id_tournoi, id_utilisateur]
    );
}

/**
 * 
 * @param {Number} id_tournoi Id du tournoi à supprimer de la TABLE tournoi_utilisateur quand id_utilisateur = 1
 */
export const delTournoiAdmin = async (id_tournoi) => {
    let connection = await connectionPromise;

    await connection.run(
        `DELETE FROM tournoi_utilisateur
        WHERE id_tournoi =? AND id_utilisateur =1`,
        [id_tournoi]
    );
}



