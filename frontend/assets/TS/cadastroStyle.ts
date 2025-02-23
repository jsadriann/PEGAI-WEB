const regButton = document.getElementById('reg') as HTMLButtonElement;
const entButton = document.getElementById('ent') as HTMLButtonElement;

const formRegistrar = document.getElementById('form-registrar') as HTMLElement;
const formEntrar = document.getElementById('form-entrar') as HTMLElement;

const section = document.getElementById('form-color') as HTMLElement;
const main = document.getElementById('teste') as HTMLElement;

regButton.addEventListener('click', () => {
    formRegistrar.classList.remove('display-none');
    formRegistrar.classList.add('form-registrar');
    formEntrar.classList.add('display-none');
    regButton.classList.remove('registrar');
    entButton.classList.add('entrar');
    section.classList.add('registrar-color');
    section.classList.remove('login-color');
    main.classList.add('registrar-color');
    main.classList.remove('login-color');
});

entButton.addEventListener('click', () => {
    formRegistrar.classList.add('display-none');
    formRegistrar.classList.remove('form-registrar');
    formEntrar.classList.add('form-login');
    formEntrar.classList.remove('display-none');
    entButton.classList.remove('entrar');
    regButton.classList.add('registrar');
    section.classList.remove('registrar-color');
    section.classList.add('login-color');
    main.classList.remove('registrar-color');
    main.classList.add('login-color');
});
