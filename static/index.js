
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
})