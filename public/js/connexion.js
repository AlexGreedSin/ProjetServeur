let formInsc = document.getElementById('form-connexion');

let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputCourriel = document.getElementById('input-courriel');

let errorConnexion = document.getElementById('error-mdp-courriel');



formInsc.addEventListener('submit', async(event) => {
    event.preventDefault();

    let data = {
        courrielUser: inputCourriel.value,
        motPasse: inputMotDePasse.value
        
    }

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/compte');
    }
    else if(response.status === 401){
        errorConnexion.innerText = 'Courriel ou mot de passe invalide';
        errorConnexion.style.display = 'block';
    }
    else {
        errorConnexion.innerText = 'Courriel ou mot de passe invalide';
        errorConnexion.style.display = 'block';
        
    }
});