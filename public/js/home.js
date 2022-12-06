/**
 * FONCTIONS POUR LA PAGE HOME
 */
let btn = document.querySelectorAll('#liste input');

//Fonction qui ajoute une inscription à tournoi_utilisateur
const inscrireTournoi = async (event) => {
    event.preventDefault();
    let data = {
        id_tournoi: event.currentTarget.dataset.id

    }
    await fetch('/tournoiinscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

}

/**
 * Fonction qui vérifie si l'admin est déjà inscrit, si oui, le bouton est disabled
 */

const verifierInscrit = async () => {
    let response = await fetch('/tournoi_inscrit');

    if (response.ok) {
        let data = await response.json();
        //loop dans le data et prend les id_tournoi 
        for (let i = 0; i < data.length; i++) {
            //parcourir les boutons, si un bouton a le même id qu'un des tournoi, son bouton se disable
            if(btn){
                for (let btnss of btn) {
                    if (parseInt(btnss.dataset.id) === data[i].id_tournoi) {
                        btnss.value = 'Déjà inscrit à ce tournoi'
                        btnss.style.backgroundColor = 'red'
    
                        btnss.disabled = true;
                        btnss.style.color = 'white'
    
    
                    }
    
                }
            }

        }


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
//Augmenter la taille de la box 
augmenterTailleListe();
if(btn) {
    for (let btnss of btn) {
        btnss.addEventListener('click', inscrireTournoi);
        btnss.addEventListener('click', verifierInscrit);
    
    }
}
//Vérifier les inscriptions quand on refresh la page
verifierInscrit();



