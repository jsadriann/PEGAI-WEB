"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu a');
    const userNameLink = document.getElementById("userNameLink");
    const loginBtn = document.getElementById('loginbtn');
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            menuLinks.forEach(link => link.classList.remove('active'));
            const target = e.target;
            target.classList.add('active');
            const page = target.getAttribute('data-content');
            loadPageContent(page);
        });
    });
    userNameLink.addEventListener('click', function (e) {
        const target = e.target;
        const page = target.getAttribute('data-content');
        loadPageContent(page);
    });
    loginBtn.addEventListener('click', function (e) {
        const target = e.target;
        const page = target.getAttribute('data-content');
        loadPageContent(page);
    });
    function loadPageContent(page) {
        location.assign(`/frontend/${page}.html`);
    }
});
