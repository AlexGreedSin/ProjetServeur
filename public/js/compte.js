

/**
 * FONCTIONS POUR LA PAGE COMPTE
 */
let btn = document.querySelectorAll('#liste input');
/**
 * 
 * @param {Event} event
 * Désincrit l'utilisateur 1 au tournoi choisi 
 */
const deleteTournoiCompte = async (event) => {

    let data = {
        id_tournoi: event.currentTarget.dataset.id
    }
    let response = await fetch('/tournoiinscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        let li = document.getElementById('tournoi' + data.id_tournoi);
        li.style.display = 'none';
    }



}
/**
 * Une simple fonction qui ajuste la taille du div qui contient la liste
 */
const augmenterTailleListe = async () => {

    let mainBox = document.getElementById('mainBox');

    let response = await fetch('/tournoi_inscrit');

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
//Augmenter la taille de la box selon la taille des données
augmenterTailleListe();

//Affecter l'évènement click à tous les boutons, appeler la fonction deleteTournoiCompte
for (let btnss of btn) {
    btnss.addEventListener('click', deleteTournoiCompte)

}

