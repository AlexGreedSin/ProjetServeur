import passport from 'passport';
import { Strategy } from 'passport-local';
import { compare } from 'bcrypt';
import { getUtilisateurByCourriel } from './model/utilisateur.js';

let config = {
    usernameField: 'courrielUser',
    passwordField: 'motPasse'
}

passport.use(new Strategy(config, async(courrielUser, motPasse, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courrielUser);

        if(!utilisateur) {
            return done(null, false, {erreur: 'erreur_courriel_utilisateur'});
        }

        let valide = await compare(motPasse, utilisateur.mot_passe);

        if(!valide) {
            return done(null, false, {erreur: 'erreur_mot_de_passe'})
        }

        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.courriel);
});

passport.deserializeUser(async (courrielUser, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courrielUser);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
