document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginbtn') as HTMLButtonElement;
    const userNameLink = document.getElementById('userNameLink') as HTMLAnchorElement;
    const logoutLink = document.getElementById('logoutLink') as HTMLAnchorElement;

    // Verifica se já existe um token no localStorage para saber se o usuário está logado
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');

    if (token && userName) {
        userNameLink.textContent = userName;
        userNameLink.style.display = 'inline';  
        logoutLink.style.display = 'inline';
        loginBtn.style.display = 'none';
    } else {
        // Caso contrário, exibe o botão de login
        loginBtn.style.display = 'inline';
    }

    // Evento de logout
    logoutLink.addEventListener('click', function () {
        resetAll();

        userNameLink.style.display = 'none';
        logoutLink.style.display = 'none';
        loginBtn.style.display = 'inline';

        location.assign('/index.html')
    });

    loginBtn.addEventListener('click', function () {
        resetAll();
        location.assign('/cadastro.html')
    });


});

function afterLoginSuccess(userName: string, token: string) {
    resetAll();
    localStorage.setItem('username', res.data.username)
    localStorage.setItem('id', res.data.id)
    localStorage.setItem('documentId', res.data.documentId)
    localStorage.setItem('role', res.data.role.name)
    localStorage.setItem('token', jwt);


    const userNameLink = document.getElementById('userNameLink') as HTMLAnchorElement;
    const logoutLink = document.getElementById('logoutLink') as HTMLAnchorElement;
    const loginBtn = document.getElementById('loginbtn') as HTMLButtonElement;

    userNameLink.textContent = userName;
    userNameLink.style.display = 'inline';
    logoutLink.style.display = 'inline';
    loginBtn.style.display = 'none';
}

