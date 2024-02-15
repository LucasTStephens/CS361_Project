
/* Set the width of the side navigation to 300px and the left margin of the page content to 310px */
function toggleNav() {
    main = document.getElementById("side-menu");
    main.classList.toggle("slideout");
    menu = document.getElementById("main-content")
    menu.classList.toggle("slideout");
  }
  