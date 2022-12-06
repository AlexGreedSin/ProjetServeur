//ADMIN
const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}

const validateDesc = (description) => {
    return typeof description === 'string' &&
            !!description &&
            description.length > 0 &&
            description.length <= 200;
}

const validateCapa = (capacite) => {
    return typeof capacite === 'number' &&
            !!capacite &&
            capacite >= 2 &&
            capacite <= 100;
}

const validateDate = (date) => {
    return typeof date === 'number' && !!date;
}

const validateIdTournoi = (id_tournoi) => {
    return typeof id_tournoi === 'number' && !!id_tournoi;
    
}
const validateIdUser = (id_utilisateur) => {
    return typeof id_utilisateur === 'number' && !!id_utilisateur;
    
}
export const validateCourriel = (courriel) => {
    return typeof courriel === 'string' && !!courriel
    && courriel.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
export const validateMotDePasse = (mot_passe) => {
    return typeof mot_passe === 'string' && !!mot_passe;
}
export const validateNomUser = (nom) => {
    return typeof nom === 'string' && !!nom;
}
export const validatePrenom = (prenom) => {
    return typeof prenom === 'string' && !!prenom;
}

export const validateTournoi = (body) => {
    return validateNom(body.nom) &&
            validateDesc(body.description) &&
            validateCapa(body.capacite) &&
            validateDate(body.date);
            
}
export const validateSuppression = (body) => {
    return validateIdTournoi(body.id_tournoi);
}

export const validateInscription = (body) => {
    return validateIdTournoi(body.id_tournoi) &&
            validateIdUser(body.id_utilisateur);
}

