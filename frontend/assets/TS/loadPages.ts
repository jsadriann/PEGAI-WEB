document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu a') as NodeListOf<HTMLAnchorElement>;
    const userNameLink = document.getElementById("userNameLink") as HTMLAnchorElement;
    const loginBtn = document.getElementById('loginbtn') as HTMLButtonElement;

    menuLinks.forEach(link => {
        link.addEventListener('click', function (e: Event) {
            e.preventDefault();

            menuLinks.forEach(link => link.classList.remove('active'));
            const target = e.target as HTMLElement;
            target.classList.add('active');

            const page = target.getAttribute('data-content')!;
            loadPageContent(page);
        });
    });

    userNameLink.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        const page = target.getAttribute('data-content')!;
        loadPageContent(page);
    });

    loginBtn.addEventListener('click', function(e:Event) {
        const target = e.target as HTMLElement;
        const page = target.getAttribute('data-content')!;
        loadPageContent(page);
    });

    function loadPageContent(page: string): void {
        location.assign(`/frontend/${page}.html`)
    }
});
