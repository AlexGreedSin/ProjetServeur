import 'dotenv/config';
import https from 'https';
import { readFile } from 'fs/promises';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import { getFictif, getTournoi, getTournoiInscription, addTournoi, inscrireTournoiUser1, delTournoi, delTournoiAdmin, getTournoiUtilisateur, delTournoiUtilisateur, getCapacite, inscrireTournoiUserFictif } from './model/tournoi.js'
import { validateTournoi, validateSuppression, validateInscription, validateCourriel, validateMotDePasse, validateNomUser, validatePrenom } from './validation.js';
import { addUtilisateur, getUtilisateur, getUtilisateurByCourriel } from './model/utilisateur.js';
import './authentification.js';


//Creation du serveur
let app = express();

//Ajouter l'engin handlebars dans express
app.engine('handlebars', engine({
    helpers: {
        //Convertir la date epoch en une date lisible
        //+86 400 000 car sinon ça affiche la journée d'avant
        afficherDate: (nombre) => (new Date(nombre + 86400000)).toLocaleDateString(),
        afficherCapa: (nombre) => nombre - 1
    }


}
));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Création du constructeur de la base de données de session
const MemoryStore = memorystore(session);

//Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static('public'));

//Routes

//Crée la route /tournoi pour visualiser tous les tournois, json
app.get('/tournoi', async (request, response) => {
    let tournoi = await getTournoi();

    response.status(200).json(tournoi);

});

//Crée la route /tournoi_inscrit pour visualiser les tournois du user 1, json
app.get('/tournoi_inscrit', async (request, response) => {
    let inscrit = await getTournoiUtilisateur(request.user?.id_utilisateur);

    response.status(200).json(inscrit);
});

//Crée la route /tournoiinscription pour visualiser tous les inscriptions, json
app.get('/tournoiinscription', async (request, response) => {
    let tournoiInscription = await getTournoiInscription();
    response.status(200).json(tournoiInscription);
});

//Crée la route /nombre_inscrit pour visualiser le nombre d'inscription pour chaques tournois
app.get('/nombre_inscrit', async (request, response) => {
    let nombre = await getCapacite();
    response.status(200).json(nombre);
});

//Crée la route /fictif pour visualiser les inscriptions du participant fictif
app.get('/fictif', async (request, response) => {
    let fictif = await getFictif();
    response.status(200).json(fictif);
});


//Crée la route /Home
app.get('/Home', async (request, response) => {


    response.render('Home', {
        titre: 'Home',
        tournois: await getTournoi(),
        user: request.user,
        aAcces: request.user?.id_type_utilisateur > 1,
        accept: request.session.accept,
        style: ['/css/home.css', '/css/headfoot.css'],
        scripts: ['/js/home.js']



    });

});
//Crée la route /Compte
app.get('/Compte', async (request, response) => {

    if (request.user) {
        response.render('Compte', {
            titre: 'Compte',
            tournois: await getTournoiUtilisateur(request.user?.id_utilisateur),
            style: ['/css/compte.css', '/css/headfoot.css'],
            scripts: ['/js/compte.js'],
            user: request.user,
            aAcces: request.user?.id_type_utilisateur > 1,
            accept: request.session.accept,
            capacitemax: await getCapacite()


        });
    }
    else {
        response.redirect('/connexion');
    }
});
//Crée la route /Admin
app.get('/Admin', async (request, response) => {
    if (request.user && request.user?.id_type_utilisateur > 1) {

        response.render('Admin', {
            titre: 'Admin',
            tournois: await getTournoi(),
            tournoi_utilisateur: await getTournoiInscription(),
            style: ['/css/admin.css', '/css/headfoot.css'],
            scripts: ['/js/admin.js'],
            aAcces: request.user?.id_type_utilisateur > 1,
            accept: request.session.accept,
            user: request.user
        });


    }
    else {
        response.status(403).end();
    }
});
//Crée la route /inscription
app.get('/inscription', (request, response) => {
    response.render('inscription', {
        titre: 'Inscription',
        style: ['/css/headfoot.css', '/css/inscription.css'],
        scripts: ['/js/inscription.js'],
        user: request.user,
        accept: request.session.accept,
        aAcces: request.user?.id_type_utilisateur > 1

    });
});
//Crée la route /connexion
app.get('/connexion', (request, response) => {

    response.render('connexion', {
        titre: 'Connexion',
        style: ['/css/headfoot.css', '/css/inscription.css'],
        scripts: ['/js/connexion.js'],
        user: request.user,
        accept: request.session.accept,
        aAcces: request.user?.id_type_utilisateur > 1



    });
});
/** PAGE HOME */
//Route inscription compte id = request.user
app.post('/tournoiinscription', async (request, response) => {
    if (!request.user) {
        response.status(401).end();
    }
    else {
        let id = await inscrireTournoiUser1(request.body.id_tournoi, request.user.id_utilisateur);

        response.status(201).json({ id: id });
        response.pushJson({
            id_tournoi: request.body.id_tournoi,
            id_utilisateur: request.user?.id_utilisateur
        }, 'inscrire-tournoi');
    }
});

/**PAGE COMPTE */
//Route désinscire un tournoi par son id, pour request.user
app.delete('/tournoiinscription', (request, response) => {
    if (!request.user) {
        response.status(401).end();
    }
    else {
        delTournoiUtilisateur(request.body.id_tournoi, request.user?.id_utilisateur);
        response.status(200).end();
        response.pushJson({
            id_tournoi: request.body.id_tournoi,
            id_utilisateur: request.user?.id_utilisateur
        }, 'desinscrire-tournoi')
    }
});

/**PAGE ADMIN */
//Ajouter un tournoi
app.post('/tournoi', async (request, response) => {
    if (!request.user) {
        response.status(401).end()
    }
    else if (request.user.id_type_utilisateur < 2) {
        response.status(403).end();
    }
    else {
        let id = await addTournoi(request.body.nom, request.body.description, request.body.capacite, request.body.date);
        response.status(201).json({ id: id });
        response.pushJson({
            id: id,
            nom: request.body.nom,
            description: request.body.description,
            capacite: request.body.capacite,
            date: request.body.date
        }, 'add-tournoi');
    }

});
//Suppression d'un tournoi
app.delete('/tournoi', (request, response) => {
    if (!request.user) {
        response.status(401).end()
    }
    else if (request.user.id_type_utilisateur < 2) {
        response.status(403).end();
    }
    else {
        delTournoi(request.body.id_tournoi);
        delTournoiUtilisateur(request.body.id_tournoi);
        response.status(200).end();
        response.pushJson({
            id: request.body.id_tournoi
        }, 'delete-tournoi');
    }
});
//Route inscription compte id=2 (utilisateur fictif)
app.post('/fictif', async (request, response) => {
    if (!request.user) {
        response.status(401).end()
    }
    else if (request.user.id_type_utilisateur < 2) {
        response.status(403).end();
    }
    else {
        let id = await inscrireTournoiUserFictif(request.body.id_tournoi);
        response.status(201).json({ id: id });
    }
    
});





//Route validation
app.post('/tournoi', (request, response) => {
    if (validateTournoi(request.body)) {
        response.status(200).end();

    }
    else {
        response.status(400).end();
    }
});

app.delete('/tournoi', (request, response) => {
    if (validateSuppression(request.body)) {
        response.status(200).end();

    }
    else {
        response.status(400).end();
    }
});

app.post('/tournoiinscription', (request, response) => {
    if (validateInscription(request.body)) {
        response.status(201).end();
    }
    else {
        response.status(400).end();
    }
});

app.delete('/tournoiinscription', (request, response) => {
    if (validateInscription(request.body)) {
        response.status(200).end();
    }
    else {
        response.status(400).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

app.post('/inscription', async (request, response, next) => {
    // Valider les données reçu du client
    if (validateCourriel(request.body.courrielUser) &&
        validateMotDePasse(request.body.motPasse) &&
        validateNomUser(request.body.nomUser) &&
        validatePrenom(request.body.prenomUser)) {
        try {
            await addUtilisateur(request.body.courrielUser, request.body.motPasse,
                request.body.prenomUser, request.body.nomUser);
            response.status(201).end();
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

app.get('/stream', (request, response) => {
    if (request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

app.post('/connexion', (request1, response, next) => {
    // Valider les données reçu du client
    if (validateCourriel(request1.body.courrielUser) &&
        validateMotDePasse(request1.body.motPasse)) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if (error) {
                next(error);
            }
            else if (!utilisateur) {
                response.status(401).json(info);
            }
            else {
                request1.logIn(utilisateur, async (error) => {
                    if (error) {
                        next(error);
                    }
                    else {
                        response.status(200).end()
                    }
                });


            }
        })(request1, response, next);
    }
    else {
        response.status(400).end();
    }


});

app.post('/deconnexion', (request, response, next) => {

    request.logOut((error) => {
        if (error) {
            next(error);
        }
        else {

            response.redirect('/connexion');
        }
    });

});

//Démarrer le serveur en http si le NODE_ENV est en production ou en https si NODE_ENV est en development 
if(process.env.NODE_ENV === 'production'){
    //Démarrer le serveur avec http
    app.listen(process.env.PORT);
    console.log(
        'Serveur démarré: http://localhost:' +
        process.env.PORT + '/connexion'
    );    
}
else{
    //Demarrer le serveur avec https
    let credentials ={
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    }

    https.createServer(credentials, app).listen(process.env.PORT);
    console.log(
        'Serveur démarré: https://localhost:' +
        process.env.PORT + '/connexion'
    );
}
