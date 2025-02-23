const formCadastro = document.getElementById("form-registrar") as HTMLFormElement;
const formLogin = document.getElementById("form-entrar") as HTMLFormElement;

const btnLogin = document.getElementById("entrar-button") as HTMLButtonElement;
const btnRegister = document.getElementById("registrar-button") as HTMLButtonElement;

//Campos do formulario login
const inputUsername = document.getElementById("user") as HTMLInputElement;
const inputPassword = document.getElementById("password-login") as HTMLInputElement;
//Campos do formulario registrar
const username = document.getElementById("username") as HTMLInputElement;
const inputNome = document.getElementById("first-name") as HTMLInputElement;
const inputSobrenome = document.getElementById("last-name") as HTMLInputElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPasswordReg = document.getElementById("password-registrar") as HTMLInputElement;
const inputConfirmPasswordReg = document.getElementById("password-registrar-verificar") as HTMLInputElement;
const inputDataNascimento = document.getElementById("data-nascimento") as HTMLInputElement;
const termsAccepted = document.getElementById('aceitar-termos')

//eventos
formCadastro.addEventListener("submit",async (event) => {
    event.preventDefault();
    const user: User = {
        username: username.value,
        email: inputEmail.value,
        password: inputPasswordReg.value,
    };

    try {
        // 🔐 Registro inicial
        const response = await api.post('/auth/local/register', user);
        console.log('Usuário cadastrado com sucesso:', response.data);

        //Atualizar campos extras após o registro
        const userId = response?.data.user.id;
        const res = await api.put(`/users/${userId}`, {
            sobrenome: inputSobrenome.value,
            nascimento:new Date(inputDataNascimento.value), // Certifique-se que está em YYYY-MM-DD
            nome: inputNome.value
        },{headers: {
            Authorization: `Bearer ${response.data.jwt}`, // Incluindo o JWT no cabeçalho
        }});
        //redirecionando pra login
        location.assign('../../cadastro.html')

        console.log('Campos adicionais atualizados com sucesso!'); 
    }catch (error: any) {
        console.error("Erro ao conectar com o servidor:", error.res?.data || error);
        alert('Erro ao cadastrar o usuário, tente novamente mais tarde.');
    }

});

formLogin?.addEventListener('submit', async(e) => {
    e.preventDefault()
    const identificador = inputUsername.value
    const senha = inputPassword.value
    await login(identificador, senha)
    
  })
  
async function login(identificador: string, senha: string) {
    let res = await api.post('/auth/local', {
      identifier: identificador,
      password: senha
    })
    console.log(res.data)
    const {jwt} = res.data
  
    res = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      params: {
        populate: ['role']
      }
    })
  
    console.log(res.data)
  
    localStorage.setItem('username', res.data.username)
    localStorage.setItem('id', res.data.id)
    localStorage.setItem('documentId', res.data.documentId)
    localStorage.setItem('role', res.data.role.name)
    localStorage.setItem('token', jwt);
    //redirecionando para home
    location.assign('/index.html')
  }