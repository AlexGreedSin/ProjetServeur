/**
 * FONCTIONS POUR LA PAGE ADMIN
 */

//Liste des tournois
let ul = document.getElementById('liste');
//Formulaire <form> pour ajouter un tournoi et l'envoyer au serveur.
let form = document.getElementById('form-tournoi');

//Champ <input> du nom du tournoi et error.
let champNom = document.getElementById('champ-nom');
let errorNom = document.getElementById('error-nom');
//Champ <input> de la date du tournoi et error.
let champDate = document.getElementById('champ-date');
let errorDate = document.getElementById('error-date');
//Champ <input> de la capacite du tournoi et error.
let champCapacite = document.getElementById('champ-capa');
let errorCapa = document.getElementById('error-capa');
//Champ <input> de la description du tournoi et error.
let champDesc = document.getElementById('champ-des');
let errorDesc = document.getElementById('error-desc');
//Champ h2
let h2 = document.getElementById('modif');
//Select tous les boutons 
let btn = document.querySelectorAll('#liste input');


/**
 * @param {Number} id id du tournoi
 * @param {String} nom nom du tournoi
 * @param {String} description description du tournoi
 * @param {Number} capacite capacité du tournoi
 * @param {Date} date date du tournoi
 */
const ajouterTournoiClient = (id, nom, description, capacite, date) => {
    //Le container dans mon body 
    let mainBox = document.getElementById('mainBox');
    let li = document.createElement('li');
    li.classList.add('jeux');
    //Information pour Nom
    let pNom = document.createElement('p');
    pNom.classList.add('infos');
    pNom.innerText = 'Nom: ' + nom;
    li.append(pNom);
    //Information pour Description
    let pDesc = document.createElement('p');
    pDesc.classList.add('infos');
    pDesc.innerText = "Description: " + description;
    li.append(pDesc);
    //Information pour Capacite
    let pCapa = document.createElement('p');
    pCapa.classList.add('infos');
    pCapa.innerText = "Capacité: 0/" + capacite;
    li.append(pCapa);
    //Information pour Date
    let pDate = document.createElement('p');
    pDate.classList.add('infos');
    pDate.innerText = "Date: " + date;
    li.append(pDate);
    //Création du button "Supprimer"
    let btnSupp = document.createElement('input');
    btnSupp.type = 'button';
    btnSupp.dataset.id = id;
    btnSupp.value = 'Supprimer';

    li.append(btnSupp);

    ul.append(li);

    mainBox.append(ul);

}
//Ajouter les informations inscritent dans le formulaire dans la base de données
const ajouterTournoiServeur = async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
        return;
    }
    //Convertir la date entrée dans le formulaire en INTEGER pour la BD
    const dateDansBox = new Date(champDate.value);
    const dateBD = (epoch(dateDansBox));
    console.log(dateBD)
    let data = {
        nom: champNom.value,
        description: champDesc.value,
        capacite: parseInt(champCapacite.value),
        date: dateBD
    }

    let response = await fetch('/tournoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (response.ok) {

        let data = await response.json();
        //ajouterTournoiClient(data.id, champNom.value, champDesc.value,
            //champCapacite.value, champDate.value);
        viderBox();
        h2.innerText = 'Ajout du tournoi : Succès!';
        h2.style.color = 'rgb(32, 192, 32)';

        //Inscrire participant fictif
        let data2 = {
            id_tournoi: data.id
        }
        await fetch('/fictif', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data2)
        });
    }


}
/**
 * @param {String} date date en valeur string (MM/DD/YYYY)
 * @returns La valeur nombre de cette date, exemple (11/17/2022) => 1668643200000
 */
const epoch = (date) => {
    return Date.parse(date);
}
//Fonction pour supprimer un tournoi de la base de données
const deleteTournoiServeur = async (event) => {
    event.preventDefault();
    let data = {
        id_tournoi: event.currentTarget.dataset.id
    }
    let response = await fetch('/tournoi', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        //let li = document.getElementById('tournoi' + data.id_tournoi);
        //li.style.display = 'none';
        h2.innerText = 'Suppression du tournoi ' + data.id_tournoi + ' : Succès!';
        h2.style.color = 'red';
    }

}
/**
 * Une simple fonction qui ajuste la taille du div qui contient la liste
 */
const augmenterTailleListe = async () => {
    let mainBox = document.getElementById('mainBox');

    let response = await fetch('/tournoi');

    if (response.ok) {
        let data = await response.json();

        if (data.length < 6) {
            mainBox.style.height = '550px';
        }
        else if (data.length === 6 || data.length === 7 || data.length === 8) {
            mainBox.style.height = '775px';
        }
        else if (data.length === 9 || data.length === 10 || data.length === 11) {
            mainBox.style.height = '1100px';
        }
        else if (data.length === 12 || data.length === 13 || data.length === 14) {
            mainBox.style.height = '1325px';
        }
        else if (data.length === 15 || data.length === 16 || data.length === 17) {
            mainBox.style.height = '1550px';
        }
    }


}


//Fonction pour effacer le contenu des champs du formulaire
const viderBox = () => {
    champNom.value = '';
    champDate.value = '';
    champCapacite.value = '';
    champDesc.value = '';

}




/*

SECTION DE VALIDATION DES DONNÉES /// VOIR validation.js

*/

/*Nom
Si l'entrée est valide, retourne rien
Si l'entrée est vide, retourne un message d'erreur et annule la soumission des données
*/
const validateNom = () => {
    if (champNom.validity.valid) {
        errorNom.style.display = 'none';
    }
    else if (champNom.validity.valueMissing) {
        errorNom.innerText = 'Veuillez donner un nom à votre tournoi';
        errorNom.style.display = 'block';
    }
}
form.addEventListener('submit', validateNom);

/*Description
Si l'entrée est valide, retourne rien
Si l'entrée est vide, retourne un message d'erreur et annule la soumission des données
Si l'entrée dépasse les 50 caractères, retourne un message d'erreur et annule la soumission des données
*/
const validateDesc = () => {
    if (champDesc.validity.valid) {
        errorDesc.style.display = 'none';
    }
    else if (champDesc.validity.valueMissing) {
        errorDesc.innerText = 'Veuillez donner une description à votre tournoi';
        errorDesc.style.display = 'block';
    }
    else if (champDesc.validity.tooLong) {
        errorDesc.innerText = 'La description doit avoir au maximum 50 caractères';
        errorDesc.style.display = 'block';
    }
}
form.addEventListener('submit', validateDesc);

/*Capacité
Si l'entrée est valide, retourne rien
Si l'entrée est vide, retourne un message d'erreur et annule la soumission des données
Si l'entrée est moins que 2 participants, retourne un message d'erreur et annule la soumission des données
Si l'entrée est plus que 100 participants, retourne un message d'erreur et annule la soumission des données
*/
const validateCapa = () => {
    if (champCapacite.validity.valid) {
        errorCapa.style.display = 'none';
    }
    else if (champCapacite.validity.valueMissing) {
        errorCapa.innerText = 'Veuillez entrer une capacité maximale';
        errorCapa.style.display = 'block';
    }
    else if (champCapacite.validity.rangeUnderflow) {
        errorCapa.innerText = '2 participants minimum';
        errorCapa.style.display = 'block';
    }
    else if (champCapacite.validity.rangeOverflow) {
        errorCapa.innerText = '100 participants maximum';
        errorCapa.style.display = 'block';
    }
}
form.addEventListener('submit', validateCapa);

/*Date
Si l'entrée est valide, retourne rien
Si l'entrée est vide, retourne un message d'erreur et annule la soumission des données
*/
const validateDate = () => {
    if (champDate.validity.valid) {
        errorDate.style.display = 'none';
    }
    else if (champDate.validity.valueMissing) {
        errorDate.innerText = 'Veuillez inscrire une date de début';
        errorDate.style.display = 'block';
    }
}
form.addEventListener('submit', validateDate);


//Ajoute l'évenement submit au formulaire afin d'ajouter un tournoi
form.addEventListener('submit', ajouterTournoiServeur);
//Augmenter la taille de la box 
augmenterTailleListe();
form.addEventListener('submit', augmenterTailleListe);



//Parcoure l'ensemble des boutons dans la liste et affecte un fonction de suppression
for (let btnss of btn) {
    btnss.addEventListener('click', deleteTournoiServeur);

}

let source = new EventSource('/stream');

//Temps réel ajout tournoi
source.addEventListener('add-tournoi', (event) => {
    let data = JSON.parse(event.data);
    ajouterTournoiClient(data.id, data.nom, data.description, data.capacite, data.date)
});

//Temps réel suppression tournoi

source.addEventListener('delete-tournoi', (event) => {
    let data = JSON.parse(event.data);
    //let bouton = document.querySelector(`input[data-id="${data.id}"]`);
    //bouton.style.display ='none';
    let li = document.getElementById('tournoi' + data.id);
    li.style.display = 'none';
});

//Temps réel inscription

source.addEventListener('inscrire-tournoi', (event) => {
    let data = JSON.parse(event.data);

    //let btn = document.querySelector(`input[data-id="${data.id_tournoi}"]`);
    let div = document.getElementById('liste-user');
    let li = document.createElement('li');
    li.innerText = `id_user: ${data.id_utilisateur}; id_tournoi: ${data.id_tournoi}`;

    div.append(li);
})
source.addEventListener('desinscrire-tournoi', (event) => {
    event.preventDefault()
    let data = JSON.parse(event.data);

    let li = document.querySelector(`li[data-id="${data.id_utilisateur}-${data.id_tournoi}"]`);
    let div = document.getElementById('liste-user');
    
    

    div.removeChild(li);
})