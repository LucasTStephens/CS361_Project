
/* Set the width of the side navigation to 300px and the left margin of the page content to 310px */
function toggleNav() {
    main = document.getElementById("side-menu");
    main.classList.toggle("slideout");
    menu = document.getElementById("main-content")
    menu.classList.toggle("slideout");
}

function toggleModal() {
    var addShowModal = document.getElementById('add-show-modal')
    var modalBackdrop = document.getElementById('modal-backdrop')

    addShowModal.classList.toggle('hidden')
    modalBackdrop.classList.toggle('hidden')
}

function selectRandomShow() {
    fetch('http://localhost:3001/random-show')
        .then(response => response.json())
        .then(data => {
            var randomShow = data.randomShow;
            var randomShowContainer = document.getElementById('random-show-container');
            randomShowContainer.innerHTML = `<p>${randomShow.name} : ${randomShow.gname}</p>`;
        })
        .catch(error => {
            console.error('Error selecting random show:', error);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    var addPostButton = document.getElementById('add-show-button')
    if (addPostButton) {
        addPostButton.addEventListener('click', toggleModal)
    }

    var modalCancelButton = document.getElementById('modal-cancel')
    if (modalCancelButton) {
        modalCancelButton.addEventListener('click', toggleModal)
    }

    var modalCloseButton = document.getElementById('modal-close')
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', toggleModal)
    }

    var randomShowButton = document.getElementById('random-show-button');
    if (randomShowButton) {
        randomShowButton.addEventListener('click', selectRandomShow);
    }
})