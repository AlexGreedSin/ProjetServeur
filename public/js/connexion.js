let formInsc = document.getElementById('form-connexion');

let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputCourriel = document.getElementById('input-courriel');


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
        let info = await response.json();
        console.log(info);
    }
    else {
        console.log("autre erreur");
    }
});