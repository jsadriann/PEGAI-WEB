document.addEventListener('DOMContentLoaded', function () {
    const userRole = localStorage.getItem('role');

    // Elementos DOM
    const elements = getElements();

    // Controle de exibição baseado no papel do usuário
    toggleButtonsBasedOnRole(userRole, elements);

    // Eventos de clique
    elements.meusprodutos.addEventListener('click', loadMeusProdutos);
    elements.updateDataBtn.addEventListener('click', showUpdateForm);
    elements.updateForm.addEventListener('submit', handleUpdateFormSubmit);
    elements.addAdminBtn.addEventListener('click', mostrarPainelAdmin);
    elements.emprestimo.addEventListener('click',carregarEmprestimos);


    elements.excluirConta.addEventListener('click', async function() {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            const user = localStorage.getItem('username')
            
            if (!token || !userId) {
                console.error('Token, ID ou Email não encontrado');
                alert("Não foi possível identificar o usuário.");
                return;
            }
    
            
            const senha = prompt("Por favor, insira sua senha para confirmar a exclusão da conta.");
    
            if (!senha) {
                console.error('Senha não fornecida');
                alert('Você precisa fornecer a senha.');
                return;
            }
    
            // Validar a senha usando a rota de autenticação
            const authResponse = await api.post('/auth/local', {
                identifier: user, 
                password: senha
            });
    
            if (authResponse.status !== 200) {
                console.error('Senha incorreta');
                alert('Senha incorreta. Tente novamente.');
                return;
            }
    
            // Confirmar a exclusão da conta
            const confirmDelete = confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");
            
            if (!confirmDelete) {
                return; 
            }
    
            // Enviar a requisição DELETE para a API usando axios
            const deleteResponse = await api.delete(`/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (deleteResponse.status === 200) {
                console.log('Conta excluída com sucesso!');
                alert("Conta excluída com sucesso!");
                resetAll(); 
                location.assign('/frontend/index.html');
            } else {
                console.error('Resposta inesperada ao excluir:', deleteResponse);
                throw new Error('Falha ao excluir a conta');
            }
        } catch (error) {
            console.error('Erro ao excluir a conta:', error);
            alert('Erro ao excluir a conta. Verifique o console para mais detalhes.');
        }
    });
    
    
    

    elements.adicionarProdutoBtn.addEventListener('click', () => {
        elements.modal.style.display = 'flex';
    });

    elements.fecharModalBtn.addEventListener('click', () => {
        elements.modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            elements.modal.style.display = 'none';
        }
    });



    async function carregarProdutosUsuario() {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            const role = localStorage.getItem('role');

            if (!token) throw new Error('Token não encontrado.');

            const res = await getProdutos(role, userId, token);
            const produtos = res.data?.data || [];
            updateProductList(produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    function getProdutos(role: string | null, userId: string | null, token: string) {
        if (role === 'admin') {
            return api.get('/produtos', { headers: { Authorization: token } });
        } else {
            return api.get(`/produtos?filters[user][id][$eq]=${userId}`, { headers: { Authorization: token } });
        }
    }

    function updateProductList(produtos) {
        elements.productList.innerHTML = '';
        if (produtos.length === 0) {
            elements.productList.innerHTML = `<tr><td colspan="3">Nenhum produto encontrado.</td></tr>`;
        } else {
            produtos.forEach((produto) => {
                elements.productList.innerHTML += `
                    <tr>
                        <td>${produto.id}</td>
                        <td>${produto.nome}</td>
                        <td>
                            <button class="action-btn update-btn" data-id="u${produto.documentId}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" data-id="d${produto.documentId}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
    
            
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', async function () {
                    const produtoId = this.getAttribute('data-id')?.substring(1); // Remove o "d" e pega o ID
                    if (!produtoId) {
                        console.error('ID do produto não encontrado');
                        return;
                    }
    
                    const confirmar = confirm('Tem certeza que deseja deletar este produto?');
                    if (!confirmar) return;
    
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            console.error('Token não encontrado');
                            alert('Você precisa estar autenticado!');
                            return;
                        }
    
                        console.log(`Deletando produto com ID: ${produtoId}`);
    
                        const response = await api.delete(`/produtos/${produtoId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
    
                        console.log('Resposta da requisição DELETE:', response);
    
                        if (response.status === 204) {
                            alert('Produto deletado com sucesso!');
                            await carregarProdutosUsuario();
                        } else {
                            console.error('Resposta inesperada ao deletar:', response);
                            throw new Error('Falha ao deletar o produto');
                        }
                    } catch (error) {
                        console.error('Erro ao deletar o produto:', error);
                        if (error.response) {
                            console.error('Detalhes do erro:', error.response.data);
                        }
                        alert('Erro ao deletar o produto. Verifique o console para mais detalhes.');
                    }
                });
            });
    
            const updateButtons = document.querySelectorAll('.update-btn');
            updateButtons.forEach((button) => {
                button.addEventListener('click', async function () {
                    const produtoId = this.getAttribute('data-id')?.substring(1); // Remove o "u" e pega o ID
                    if (!produtoId) {
                        console.error('ID do produto não encontrado');
                        return;
                    }
    
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            console.error('Token não encontrado');
                            alert('Você precisa estar autenticado!');
                            return;
                        }
    
                        const response = await api.get(`/produtos/${produtoId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
    
                        const produto = response.data.data;
                        console.log(produto);
    
                        elements.nomeProdutoAtualizar.value = produto.nome;
                        elements.descricaoProdutoAtualizar.value = produto.descricao;
                        elements.quantidadeProdutoAtualizar.value = produto.quantidade;
    
                        // Exibir o modal de atualização
                        elements.modalAtualizarProduto.style.display = 'flex';
                        elements.produtoId.value = produtoId;
    
                    } catch (error) {
                        console.error('Erro ao carregar os dados do produto:', error);
                        alert('Erro ao carregar os dados do produto. Verifique o console para mais detalhes.');
                    }
                });
            });
        }
    }

    
    
    // Fechar o modal de atualização
    elements.fecharModalAtualizar.addEventListener('click', () => {
        elements.modalAtualizarProduto.style.display = 'none';
    });
    
    // Submeter o formulário de atualização
    elements.formAtualizarProduto.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const produtoId = elements.produtoId.value;
        const nome = elements.nomeProdutoAtualizar.value;
        const descricao = elements.descricaoProdutoAtualizar.value;
        const quantidade = elements.quantidadeProdutoAtualizar.value;
    
        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!nome || !descricao || !quantidade) {
            alert('Todos os campos são obrigatórios!');
            return;
        }
    
        if (!produtoId) {
            alert('ID do produto não encontrado');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado');
                alert('Você precisa estar autenticado!');
                return;
            }
    
            const produtoData = {
                nome,
                descricao,
                quantidade: parseInt(quantidade, 10),
            };
    
            // Atualizar o produto
            const response = await api.put(`/produtos/${produtoId}`, {
                data: produtoData,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                console.log('Produto atualizado com sucesso!');
                alert('Produto atualizado com sucesso!');
                elements.modalAtualizarProduto.style.display = 'none';
                // Recarregar a lista de produtos após a atualização
                await carregarProdutosUsuario();
            } else {
                console.error('Resposta inesperada ao atualizar:', response);
                throw new Error('Falha ao atualizar o produto');
            }
    
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            alert('Erro ao atualizar o produto. Verifique o console para mais detalhes.');
        }
    });
    

    // Adicionar evento blur nos campos do formulário
    elements.nomeProdutoAtualizar.addEventListener('blur', () => {
        if (!elements.nomeProdutoAtualizar.value) {
            addPlaceholder(elements.nomeProdutoAtualizar);
        } else {
            elements.nomeProdutoAtualizar.removeAttribute('placeholder');
        }
    });

    elements.descricaoProdutoAtualizar.addEventListener('blur', () => {
        if (!elements.descricaoProdutoAtualizar.value) {
            addPlaceholder(elements.descricaoProdutoAtualizar);
        } else {
            elements.descricaoProdutoAtualizar.removeAttribute('placeholder');
        }
    });

    elements.quantidadeProdutoAtualizar.addEventListener('blur', () => {
        if (!elements.quantidadeProdutoAtualizar.value) {
            addPlaceholder(elements.quantidadeProdutoAtualizar);
        } else {
            elements.quantidadeProdutoAtualizar.removeAttribute('placeholder');
        }
    });

    elements.carrinho.addEventListener('click', (event) => {
        event.preventDefault();
        showCarrinho();
        updateCarrinhoList();
    });

    function updateCarrinhoList() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        elements.carrinhoList.innerHTML = ''; 
    
        if (carrinho.length === 0) {
            elements.carrinhoList.innerHTML = `<tr><td colspan="2">🛒 Carrinho vazio.</td></tr>`;
        } else {
            carrinho.forEach((produto, index) => {
                elements.carrinhoList.innerHTML += `
                    <tr>
                        <td>${produto.nome}</td>
                        <td>
                            <button class="remove-carrinho-btn" data-index="r${index}"></button>
                        </td>
                    </tr>
                `;
            });
        }
    
        document.querySelectorAll('.remove-carrinho-btn').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                removerProdutoDoCarrinho(index);
            });
        });
    }
    
    function removerProdutoDoCarrinho(index) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.splice(index, 1);  // Remove o item do array
        localStorage.setItem('carrinho', JSON.stringify(carrinho));  // Salva de volta no localStorage
        updateCarrinhoList();
    }
    
    // Função para esvaziar o carrinho
    elements.esvaziarCarrinhoBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
            localStorage.removeItem('carrinho');
            updateCarrinhoList();  // Atualiza a lista
            alert('Carrinho esvaziado!');
        }
    });
    
    // Função para solicitar empréstimo
    elements.solicitarEmprestimoBtn.addEventListener('click',criarEmprestimo);

    async function criarEmprestimo() {
        try {
          const carrinho = JSON.parse(localStorage.getItem('carrinho') as string) || [];
          const produtosIds = carrinho.map((produto: any) => produto.documentId);
      
          const novoEmprestimo = {
            data: {
              emprestado: true,
              user: localStorage.getItem('documentId'),
              produtos: produtosIds,
            },
          };
      
          const response = await api.post('/emprestimos', novoEmprestimo,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log('Empréstimo criado:', response.data);
          localStorage.removeItem('carrinho');
          updateCarrinhoList();
        } catch (error) {
          console.error('Erro ao criar empréstimo:', error);
        }
      }



    async function updateUser(
        nome?: string,
        sobrenome?: string,
        password?: string,
        userId?: string,
        token?: string
    ): Promise<any | null> {
        try {
            if (!userId || !token) throw new Error('userId e token são obrigatórios.');
            const updateData: Record<string, string> = buildUpdateData(nome, sobrenome, password);

            if (Object.keys(updateData).length === 0){
                alert('No update data')
                return null;
            }

            const response = await api.put(`/users/${userId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Usuário atualizado com sucesso!');
            alert('Dados atualizados com sucesso')
            return response.data;
        } catch (error: any) {
            console.error('Erro ao atualizar o usuário:', error.response?.data || error.message);
            throw error;
        }
    }

    function buildUpdateData(nome?: string, sobrenome?: string, password?: string) {
        const updateData: Record<string, string> = {};
        if (nome) updateData.nome = nome;
        if (sobrenome) updateData.sobrenome = sobrenome;
        if (password) updateData.password = password;
        return updateData;
    }

    function handleUpdateFormSubmit(e: Event) {
        e.preventDefault();

        const updateData: Record<string, string> = {
            nome: elements.nome.value,
            sobrenome: elements.sobrenome.value,
            password: elements.senha.value,
            password_confirmation: elements.confSenha.value,
        };

        if (confirmValidate(updateData)) {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            const ap = updateUser(updateData.nome, updateData.sobrenome, updateData.password, userId, token);

        }
    }
    function showEmprestimos(){
        elements.updateFormContainer.style.display = 'none';
        elements.meusProdutosContainer.style.display = 'none';
        elements.modal.style.display = 'none';
        elements.carrinhoContainer.style.display ='none'
        elements.painelAdmin.style.display = 'none';
        elements.meusEmprestimos.style.display = 'block';
    }

    function confirmValidate(user: Record<string, string>): boolean {
        const senhaValida = user.password === user.password_confirmation;
        elements.senha.classList.toggle('isInvalid', !senhaValida);
        elements.confSenha.classList.toggle('isInvalid', !senhaValida);
        return senhaValida;
    }

    function showUpdateForm() {
        elements.updateFormContainer.style.display = 'block';
        elements.meusProdutosContainer.style.display = 'none';
        elements.modal.style.display = 'none';
        elements.carrinhoContainer.style.display ='none'
        elements.painelAdmin.style.display = 'none';
        elements.meusEmprestimos.style.display = 'none';
    }
    async function loadMeusProdutos() {
        elements.updateFormContainer.style.display = 'none';
        elements.meusProdutosContainer.style.display = 'block';
        elements.carrinhoContainer.style.display ='none';
        elements.painelAdmin.style.display = 'none';
        elements.meusEmprestimos.style.display = 'none';
        await carregarProdutosUsuario();
    }
        // Função para mostrar o painel de admin quando o botão for clicado
    function mostrarPainelAdmin() {
        alert("Mostrar");
        
        elements.painelAdmin.style.display = 'block';
        elements.updateFormContainer.style.display = 'none';
        elements.meusProdutosContainer.style.display = 'none';
        elements.carrinhoContainer.style.display ='none';
        elements.meusEmprestimos.style.display = 'none';
        

        // Carregar os usuários quando o painel for exibido
        carregarUsuariosAdmin();
    }


    async function carregarEmprestimos() {
        showEmprestimos()
        try {
            const { data } = await api.get('/emprestimos', {
                params: {
                populate: ['produtos'],
                filters: {
                    user:  localStorage.getItem('userId') ,
                },
                },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

        const emprestimos = data.data;
        console.log(emprestimos);
        const tbody = document.getElementById('emprestimosList');
        tbody.innerHTML = '';
        if (emprestimos.length === 0) {
            const semEmprestimosHtml = `
              <tr id="sem-emprestimos">
                <td colspan="3">Sem Empréstimos</td>
              </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', semEmprestimosHtml);
          } else {
            emprestimos.forEach((emprestimo) => {
                const { id, emprestado, produtos } = emprestimo;
                const status = emprestado ? 'confirmado' : 'em analise';
            
                const produtosHtml = produtos && produtos.length
                ? produtos.map((produto) => `<li>${produto.nome}</li>`).join('')
                : '<li>Sem produtos</li>';

                const row = `
                <tr>
                    <td>${id}</td>
                    <td>
                    <div class="dropdown-container">
                        <button class="dropdown-btn" onclick="toggleDropdown(${id})">
                        Ver Produtos (${produtos.length})
                        </button>
                        <ul class="dropdown-content" id="dropdown-content-${id}">
                        ${produtosHtml}
                        </ul>
                    </div>
                    </td>
                    <td><span class="${getStatusClass(status)}">${status.toUpperCase()}</span></td>
                </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', row);
            });
          }

        document.getElementById('meus-emprestimos-container').style.display = 'block';
        } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        }
    }

    function showCarrinho() {
        elements.updateFormContainer.style.display = 'none';
        elements.meusProdutosContainer.style.display = 'none';
        elements.modal.style.display = 'none';
        elements.carrinhoContainer.style.display ='block'
        elements.meusEmprestimos.style.display = 'none';
    }

    elements.nomeProduto.addEventListener('blur', () => addPlaceholder(elements.nomeProduto));
    elements.descricaoProduto.addEventListener('blur', () => addPlaceholder(elements.descricaoProduto));
    elements.quantidadeProduto.addEventListener('blur', () => addPlaceholder(elements.quantidadeProduto));
    elements.fotoProduto.addEventListener('blur', () => addPlaceholder(elements.fotoProduto));

    elements.formAdicionarProduto.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        if (!elements.nomeProduto.value || !elements.descricaoProduto.value || !elements.quantidadeProduto.value || !elements.fotoProduto.files.length) {
            alert('Todos os campos são obrigatórios!');
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) return console.error('Usuário não autenticado');
    
        try {
            let fotoId: number | null = null;
    
            if (elements.fotoProduto.files && elements.fotoProduto.files[0]) {
                const imagemFormData = new FormData();
                imagemFormData.append('files', elements.fotoProduto.files[0]);
    
                const UploadResponse = await api.post('/upload', imagemFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                fotoId = UploadResponse.data[0]?.id;
                if (!fotoId) throw new Error('Erro ao fazer upload da imagem.');
            }

            const produtoPayload = {
                data: {
                    nome: elements.nomeProduto.value,
                    descricao: elements.descricaoProduto.value,
                    quantidade: parseInt(elements.quantidadeProduto.value, 10),
                    foto: fotoId,
                    user: localStorage.getItem('documentId'),
                },
            };
    
            const produtoResponse = await api.post('/produtos', produtoPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (produtoResponse.status === 201) {
                console.log('Produto adicionado com sucesso!', produtoResponse.data);
                alert('Produto cadastrado com sucesso!');
                elements.formAdicionarProduto.reset();
                elements.modal.style.display = 'none';
                await carregarProdutosUsuario();
            }
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao cadastrar o produto. Verifique o console para mais detalhes.');
        }
    });
    
});

function getElements() {
    return {
        removeUsersBtn: document.getElementById('remove-users-btn') as HTMLButtonElement,
        addAdminBtn: document.getElementById('add') as HTMLButtonElement,
        meusprodutos: document.getElementById('meusprodutos') as HTMLButtonElement,
        excluirConta: document.getElementById('excluir-conta') as HTMLButtonElement,
        updateFormContainer: document.getElementById('update-form-container') as HTMLElement,
        meusProdutosContainer: document.getElementById('meus-produtos-container') as HTMLElement,
        carrinho: document.getElementById('carrinho') as HTMLButtonElement,
        productList: document.getElementById('productList') as HTMLElement,
        updateDataBtn: document.getElementById('update-data-btn') as HTMLButtonElement,
        adicionarProdutoBtn: document.getElementById('adicionarProdutoBtn') as HTMLButtonElement,
        updateForm: document.getElementById('update-form') as HTMLFormElement,
        nome: document.getElementById('nome') as HTMLInputElement,
        sobrenome: document.getElementById('sobrenome') as HTMLInputElement,
        senha: document.getElementById('senha') as HTMLInputElement,
        confSenha: document.getElementById('confirm-senha') as HTMLInputElement,
        modal: document.getElementById('modal-adicionar-produto') as HTMLElement,
        fecharModalBtn: document.getElementById('fechar-modal') as HTMLButtonElement,
        formAdicionarProduto: document.getElementById('form-adicionar-produto') as HTMLFormElement,
        nomeProduto: document.getElementById('nome-produto') as HTMLInputElement,
        descricaoProduto: document.getElementById('descricao-produto') as HTMLTextAreaElement,
        quantidadeProduto: document.getElementById('quantidade-produto') as HTMLInputElement,
        fotoProduto: document.getElementById('foto-produto') as HTMLInputElement,
        modalAtualizarProduto: document.getElementById('modal-atualizar-produto') as HTMLElement,
        fecharModalAtualizar: document.getElementById('fechar-modal-atualizar') as HTMLButtonElement,
        formAtualizarProduto: document.getElementById('form-atualizar-produto') as HTMLFormElement,
        nomeProdutoAtualizar: document.getElementById('nome-produto-atualizar') as HTMLInputElement,
        descricaoProdutoAtualizar: document.getElementById('descricao-produto-atualizar') as HTMLTextAreaElement,
        quantidadeProdutoAtualizar: document.getElementById('quantidade-produto-atualizar') as HTMLInputElement,
        fotoProdutoAtualizar: document.getElementById('foto-produto-atualizar') as HTMLInputElement,
        fotoAtualAtualizar: document.getElementById('foto-atual-atualizar') as HTMLElement,
        produtoId: document.getElementById('produto-id') as HTMLInputElement,
        carrinhoContainer: document.getElementById('carrinho-container'),
        carrinhoList: document.getElementById('carrinho-list'),
        esvaziarCarrinhoBtn: document.getElementById('esvaziar-carrinho'),
        solicitarEmprestimoBtn: document.getElementById('solicitar-emprestimo'),
        painelAdmin: document.getElementById('painel-admin-container') as HTMLElement,
        emprestimo: document.getElementById('emprestimo') as HTMLButtonElement,
        meusEmprestimos: document.getElementById('meus-emprestimos-container') as HTMLElement,
    };
}

const addPlaceholder = (element: HTMLInputElement | HTMLTextAreaElement) => {
    if (element.value === '') {
        element.setAttribute('placeholder', 'Por favor, preencha!');
    } else {
        element.removeAttribute('placeholder');
    }
};

function toggleButtonsBasedOnRole(userRole: string | null, elements: any) {
    if (userRole !== 'admin') {
        ['removeUsersBtn', 'addAdminBtn'].forEach((btn) => {
            elements[btn]?.classList.add('disabled');
            elements[btn]?.addEventListener('click', (e: Event) => e.preventDefault());
        });
    } else {
        ['updateDataBtn', 'carrinho', 'adicionarProdutoBtn'].forEach((btn) => {
            elements[btn]?.classList.add('disabled');
            elements[btn]?.addEventListener('click', (e: Event) => e.preventDefault());
        });
    }
}

// Função para carregar usuários com a role "admin"
async function carregarUsuariosAdmin() {
    try {
        // Realizando a requisição para buscar os usuários com role "admin"
        const response = await api.get('/users', {
            params: {
                _limit: 100,           // Limitar a quantidade de resultados, caso necessário
                populate: 'role',      // Popula o campo 'role' para trazer as informações associadas
            },
        });

        const usuarios = response.data.filter(
            (usuario: any) =>
                usuario.role?.name === 'admin' &&
                usuario.username !== localStorage.getItem('username')
        );
        //const usuarios = response.data
        console.log(usuarios)
        // Atualizando a tabela com os dados dos usuários
        atualizarTabelaUsuarios(usuarios);
    } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
        alert('Erro ao carregar os usuários.');
    }
}

// Função para atualizar a tabela de usuários
function atualizarTabelaUsuarios(usuarios: any[]) {
    const tabelaUsuarios = document.getElementById('userList') as HTMLElement;
    tabelaUsuarios.innerHTML = '';

    if (usuarios.length === 0) {
        tabelaUsuarios.innerHTML = `<tr><td colspan="3">Nenhum usuário encontrado.</td></tr>`;
    } else {
        usuarios.forEach((usuario) => {
            tabelaUsuarios.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.username}</td>
                    <td>
                        <button class="action-btn delete-btn" data-id="d${usuario.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // 🗑️ Adicionando o evento de deletar em todos os botões delete
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', async function () {
                const usuarioId = this.getAttribute('data-id')?.substring(1); // Remove o "d" e pega o ID
                if (!usuarioId) {
                    console.error('ID do usuário não encontrado');
                    return;
                }

                const confirmar = confirm('Tem certeza que deseja deletar este usuário?');
                if (!confirmar) return;

                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token não encontrado');
                        alert('Você precisa estar autenticado!');
                        return;
                    }

                    console.log(`Deletando usuário com ID: ${usuarioId}`);

                    const response = await api.delete(`/users/${usuarioId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log('Resposta da requisição DELETE:', response);

                    if (response.status === 204) {
                        alert('Usuário deletado com sucesso!');
                        // Atualiza a lista após deletar
                        await carregarUsuariosAdmin();
                    } else {
                        console.error('Resposta inesperada ao deletar:', response);
                        throw new Error('Falha ao deletar o usuário');
                    }
                } catch (error) {
                    console.error('Erro ao deletar o usuário:', error);
                    if (error.response) {
                        console.error('Detalhes do erro:', error.response.data);
                    }
                    alert('Erro ao deletar o usuário. Verifique o console para mais detalhes.');
                }
            });
        });
    }
}

function toggleDropdown(id) {
    const dropdown = document.getElementById(`dropdown-content-${id}`);
    dropdown.classList.toggle('show');
  
    if (dropdown.classList.contains('show')) {
      // Reset para garantir a reavaliação
      dropdown.classList.remove('open-up');
  
      const rect = dropdown.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
      // Se ultrapassar a altura da tela, abre para cima
      if (rect.bottom > windowHeight) {
        dropdown.classList.add('open-up');
      }
    }
  }
  
  

  function getStatusClass(status) {
    switch (status) {
      case 'confirmado':
        return 'status-confirmado';
      case 'recusado':
        return 'status-recusado';
      case 'analise':
      default:
        return 'status-analise';
    }
  }











