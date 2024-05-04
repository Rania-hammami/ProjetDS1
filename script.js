'use strict';

let wrapper = document.querySelector('.slider');
let toolbarToggle = document.getElementById('toolbar-toggle');
let thumbnails = document.querySelectorAll('.thumbnail');
let thumbnailsPrevBtn = document.getElementById('thumbnails-previous');
let thumbnailsNextBtn = document.getElementById('thumbnails-next');
let images = Array.from(thumbnails);

var currentIndex = 0;

const TOUCHE_ESPACE = 32;
const TOUCHE_GAUCHE = 37;
const TOUCHE_DROITE = 39;

var state;

// Ajoutez un gestionnaire d'événements au lien "Barre d'outils"
toolbarToggle.addEventListener('click', function(event) {
    // Sélectionnez la liste des miniatures
    let thumbnailsList = document.getElementById('thumbnails');

    // Basculez la classe "hide" pour masquer ou afficher les miniatures
    thumbnailsList.classList.toggle('hide');
});
// Mettez à jour l'image principale du slider
function updateImage() {
    var imgElement = document.querySelector('#slider img');

   
    imgElement.classList.add('fadeOut');    // Appliquer l'animation de disparition à l'ancienne image

    // Attendre la fin de l'animation de disparition
    imgElement.addEventListener('animationend', function() {
        // Mettre à jour l'image
        imgElement.src = images[currentIndex].src;      // Modification de la source de l'image

        // Supprimer l'animation de disparition et appliquer l'animation d'apparition
        imgElement.classList.remove('fadeOut');
        imgElement.classList.add('fadeIn');

        // Attendre la fin de l'animation d'apparition
        imgElement.addEventListener('animationend', function() {
            imgElement.classList.remove('fadeIn');     // Supprimer l'animation d'apparition
        }, { once: true });
    }, { once: true });
}
// Ajoutez un gestionnaire d'événements à chaque miniature
thumbnails.forEach((thumbnail, i) => { // Utilisation de forEach pour itérer sur les miniatures
    thumbnail.addEventListener('click', function(event) {
        currentIndex = i;    //lorsque on cliquer sur le moniature mettre à jour l'index et l'mage principal
        updateImage();
    });
});

images.forEach(img => {
    img.addEventListener('click', function() {
        wrapper.innerHTML = '';
        let newImg = document.createElement('img');
        newImg.src = this.src;
        wrapper.appendChild(newImg);
    });
});

var slides = [
    { image: 'images/img1.jpg' },
    { image: 'images/img2.jpg' },
    { image: 'images/img3.jpg' },
    { image: 'images/img4.jpg' },
    { image: 'images/img5.jpg' },
    { image: 'images/img6.jpg' },
    { image: 'images/img7.jpg' },
    { image: 'images/img8.jpg' },
    { image: 'images/img9.jpg' },
    { image: 'images/img10.jpg' },
];

function onSliderGoToNext() {
    state.index++;   //passe à la slide suivant
    if (state.index == slides.length) {          //teste si on arrive à la fin de liste de slider si oui on revient au début
        state.index = 0;
    }

    refreshSlider();  // Mise à jour de l'affichage.
}

function onSliderGoToPrevious() {
    state.index--;  // Passage à la slide précédente.

    if (state.index < 0) {  //si on arrive à la fin de la liste si oui on revient à la fin
        state.index = slides.length - 1;
    }

    refreshSlider();
}

function onSliderGoToRandom() {  //Récupération d'un numéro de slide aléatoire différent
    var index;

    do {
       
        index = getRandomInteger(0, slides.length - 1);
    } while (index == state.index);

    state.index = index;   // Passe à une slide aléatoire.

    refreshSlider();    // Mise à jour de l'affichage.
}

function onSliderKeyUp(event) {
    switch (event.keyCode) {
        case TOUCHE_DROITE:        //  passe  slide suivante.  
            onSliderGoToNext();    
            break;

        case TOUCHE_ESPACE:      // démarre ou on arrête le carrousel.
            onSliderToggle();
            break;

        case TOUCHE_GAUCHE:    // passe à slide précédente.
            onSliderGoToPrevious();
            break;
    }
}

function onSliderToggle() {
    var icon;

    // Modificer l'icône du bouton pour démarrer ou arrêter le carrousel.
    icon = document.querySelector('#slider-toggle i');
    icon.classList.toggle('fa-play');
    icon.classList.toggle('fa-pause');
    if (state.timer == null) {    //teste si le carousel est démarré
        state.timer = window.setInterval(onSliderGoToNext, 2000);   // Non démarrage du carousel chaque deux secondes.
        this.title = 'Arrêter le carrousel';
    } else {
        window.clearInterval(state.timer); // Oui, arrêt du carousel.
        state.timer = null;     // Réinitialiser  pour le prochain clic sur le bouton.

        this.title = 'Démarrer le carrousel';
    }
}

function onToolbarToggle() {
    var icon;

    // Modification de l'icône du lien pour afficher ou cacher la barre d'outils.
    icon = document.querySelector('#toolbar-toggle i');

    icon.classList.toggle('fa-arrow-down');
    icon.classList.toggle('fa-arrow-right');

    // Affiche ou cache la barre d'outils.
    document.querySelector('.toolbar ul');
}

function refreshSlider() {
    var sliderImage;
    var sliderLegend;

    // Recherche des balises de contenu du carrousel.
    sliderImage = document.querySelector('#slider img');
    sliderLegend = document.querySelector('#slider figcaption');

    // Changement de la source de l'image et du texte de la légende du carrousel.
    sliderImage.src = slides[state.index].image;
    sliderLegend.textContent = slides[state.index].legend;
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialisation du carrousel.
    state = {};
    state.index = 0;                   // On commence à la première slide
    state.timer = null;                // Le carrousel est arrêté au démarrage

    // Installation des gestionnaires d'évènement.
    installEventHandler('#slider-random', 'click', onSliderGoToRandom);
    installEventHandler('#slider-previous', 'click', onSliderGoToPrevious);
    installEventHandler('#slider-next', 'click', onSliderGoToNext);
    installEventHandler('#slider-toggle', 'click', onSliderToggle);
    installEventHandler('#toolbar-toggle', 'click', onToolbarToggle);

    document.addEventListener('keyup', onSliderKeyUp);
    // Equivalent à installEventHandler('html', 'keyup', onSliderKeyUp);

    // Affichage initial.
    refreshSlider();
});

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function installEventHandler(selector, type, eventHandler) {
    var domObject;

    // Récupération du premier objet DOM correspondant au sélecteur.
    domObject = document.querySelector(selector);

    // Installation d'un gestionnaire d'évènement sur cet objet DOM.
    domObject.addEventListener(type, eventHandler);
}

// Fonction pour masquer ou afficher la barre d'outils
toolbarToggle.addEventListener('click', function(event) {
    document.querySelector('.toolbar ul').classList.toggle('hide');
});

// Initialisation des variables pour la pagination des miniatures
const thumbnailsPerPage = 5; 
let currentPage = 1; 

// Fonction pour afficher les miniatures de la page spécifiée
function displayThumbnails(page) {
    const startThumbnailIndex = (page - 1) * thumbnailsPerPage;
    const endThumbnailIndex = Math.min(startThumbnailIndex + thumbnailsPerPage, thumbnails.length);

    thumbnails.forEach(thumbnail => {
        thumbnail.style.display = 'none';
    });

    for (let i = startThumbnailIndex; i < endThumbnailIndex; i++) {
        thumbnails[i].style.display = 'inline-block';
    }
}

// Événement pour passer à la page suivante des miniatures
thumbnailsNextBtn.addEventListener('click', function() {
    if (currentPage < Math.ceil(thumbnails.length / thumbnailsPerPage)) {
        currentPage++;
        displayThumbnails(currentPage);
    }
});

// Événement pour passer à la page précédente des miniatures
thumbnailsPrevBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayThumbnails(currentPage);
    }
});

// Fonction pour mettre à jour la sélection de miniature
function updateThumbnailSelection() {
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentPage * thumbnailsPerPage - thumbnailsPerPage) {
            thumbnail.classList.add('selected');
        } else {
            thumbnail.classList.remove('selected');
        }
    });
}

// Événement pour changer l'image principale lors du clic sur une miniature
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', function() {
        updateImage(this.src);
        currentPage = Math.ceil((index + 1) / thumbnailsPerPage);
        updateThumbnailSelection();
    });
});

// Appel initial pour afficher les miniatures de la première page
displayThumbnails(currentPage);
// Appel initial pour mettre en surbrillance la miniature actuelle
updateThumbnailSelection(); 

