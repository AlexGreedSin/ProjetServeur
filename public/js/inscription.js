let formInsc = document.getElementById('form-insc');
let inputNomUtilisateur = document.getElementById('input-nom');
let errorNomU = document.getElementById('error-nomm');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let errorMDP = document.getElementById('error-password');
let inputCourriel = document.getElementById('input-courriel');
let errorCourriel = document.getElementById('error-email');
let inputPrenomUtilisateur = document.getElementById('input-prenom');
let errorPrenom = document.getElementById('error-prenom');

let btnIscrire = document.getElementById('btnInscrire');



/*

SECTION DE VALIDATION DES DONNÉES /// VOIR validation.js

*/

const validateCourrielClient = () => {
    
    if (inputCourriel.validity.valueMissing) {
        errorCourriel.innerText = 'Veuillez entrer votre courriel';
        errorCourriel.style.display = 'block';
    }
    else if(!inputCourriel.validity.valid){
        errorCourriel.innerText = 'Veuillez entrer un courriel valide: exemple@gmail.com';
        errorCourriel.style.display = 'block';
    }
    else {
        errorCourriel.style.display = 'none';
    }
}
let string = "111"
string.mat
formInsc.addEventListener('submit', validateCourrielClient);

const validateMotDePasseClient = () => {
    if (inputMotDePasse.validity.valid) {
        errorMDP.style.display = 'none';
    }
    else if (inputMotDePasse.validity.valueMissing) {
        errorMDP.innerText = 'Veuillez entrer un mot de passe';
        errorMDP.style.display = 'block';
    }
    else{
        errorMDP.innerText = 'Votre mot de passe doit contenir au moins 5 charactères';
        errorMDP.style.display = 'block';
    }
}
formInsc.addEventListener('submit', validateMotDePasseClient);

const validateNomClient = () => {
    if (inputNomUtilisateur.validity.valid) {
        errorNomU.style.display = 'none';
    }
    else if (inputNomUtilisateur.validity.valueMissing) {
        errorNomU.innerText = 'Veuillez entrer votre nom';
        errorNomU.style.display = 'block';
    }

}
formInsc.addEventListener('submit', validateNomClient);

const validatePrenomClient = () => {
    if (inputPrenomUtilisateur.validity.valid) {
        errorPrenom.style.display = 'none';
    }
    else if (inputPrenomUtilisateur.validity.valueMissing) {
        errorPrenom.innerText = 'Veuillez entrer votre prénom';
        errorPrenom.style.display = 'block';
    }

}
formInsc.addEventListener('submit', validatePrenomClient);


formInsc.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courrielUser: inputCourriel.value,
        motPasse: inputMotDePasse.value,
        prenomUser: inputPrenomUtilisateur.value,
        nomUser: inputNomUtilisateur.value

    }
    if (inputCourriel.validity.valid && inputMotDePasse.validity.valid
        && inputNomUtilisateur.validity.valid && inputPrenomUtilisateur.validity.valid) {

        let response = await fetch('/inscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.replace('/connexion');
        }
        else if (response.status === 409) {
            console.log(response.status);
        }
        else {
            errorCourriel.innerText = 'Veuillez entrer un courriel valide: exemple@gmail.com';
            errorCourriel.style.display = 'block';
        }
    }
});

