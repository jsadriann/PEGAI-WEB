"use strict";
const formCadastro = document.getElementById("form-registrar");
const formLogin = document.getElementById("form-entrar");
const btnLogin = document.getElementById("entrar-button");
const btnRegister = document.getElementById("registrar-button");
//Campos do formulario login
const inputUsername = document.getElementById("user");
const inputPassword = document.getElementById("password-login");
//Campos do formulario registrar
const username = document.getElementById("username");
const inputNome = document.getElementById("first-name");
const inputSobrenome = document.getElementById("last-name");
const inputEmail = document.getElementById("email");
const inputPasswordReg = document.getElementById("password-registrar");
const inputConfirmPasswordReg = document.getElementById("password-registrar-verificar");
const inputDataNascimento = document.getElementById("data-nascimento");
const termsAccepted = document.getElementById('aceitar-termos');
//eventos
formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = {
        username: username.value,
        email: inputEmail.value,
        password: inputPasswordReg.value,
    };
    try {
        //Registro inicial
        const response = await api.post('/auth/local/register', user);
        console.log('Usuário cadastrado com sucesso:', response.data);
        //Atualizar campos extras após o registro
        const userId = response?.data.user.id;
        const res = await api.put(`/users/${userId}`, {
            sobrenome: inputSobrenome.value,
            nascimento: new Date(inputDataNascimento.value),
            nome: inputNome.value
        }, { headers: {
                Authorization: `Bearer ${response.data.jwt}`,
            } });
        //redirecionando pra login
        location.assign('/frontend/cadastro.html');
        console.log('Campos adicionais atualizados com sucesso!');
    }
    catch (error) {
        console.error("Erro ao conectar com o servidor:", error.res?.data || error);
        alert('Erro ao cadastrar o usuário, tente novamente mais tarde.');
    }
});
formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identificador = inputUsername.value;
    const senha = inputPassword.value;
    await login(identificador, senha);
});
async function login(identificador, senha) {
    try {
        // Fazendo a requisição de login
        let res = await api.post('/auth/local', {
            identifier: identificador,
            password: senha
        });
        console.log(res.data);
        const { jwt } = res.data;
        // Buscando informações do usuário autenticado
        res = await api.get('/users/me', {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            params: {
                populate: ['role']
            }
        });
        console.log(res.data);
        //Armazenando dados no localStorage
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('id', res.data.id);
        localStorage.setItem('documentId', res.data.documentId);
        localStorage.setItem('role', res.data.role.name);
        localStorage.setItem('roleId', res.data.role.id);
        localStorage.setItem('token', jwt);
        //Redirecionando para a página inicial
        location.assign('/frontend/index.html');
    }
    catch (error) {
        console.error('Erro durante o login:', error);
        alert('Falha na autenticação. Verifique suas credenciais e tente novamente.');
    }
}
