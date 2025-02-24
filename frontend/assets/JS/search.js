"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    function isUserLoggedIn() {
        return localStorage.getItem('token');
    }
    // function salvarProdutoNoLocalStorage(produto) {
    //     const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    //     carrinho.push(produto);
    //     localStorage.setItem('carrinho', JSON.stringify(carrinho));
    // }
    searchInput.addEventListener('input', async function () {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }
        try {
            const response = await api.get(`/produtos?filters[nome][$contains]=${query}&populate=user`);
            const produtos = response.data.data;
            if (produtos.length > 0) {
                searchResults.innerHTML = produtos.map(produto => {
                    const nomeUsuario = produto.user ? produto.user.username : 'Usuário desconhecido';
                    return `
                        <div class="search-result">
                            <span class="product-name">${produto.nome}</span>
                            <span class="product-owner">${nomeUsuario}</span>
                            <div class="action-buttons">
                                <button class="add-to-cart" data-id="${produto.id}" data-nome="${produto.nome}">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                                <button class="view-more" data-id="${produto.id}">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                searchResults.style.display = 'block';
            }
            else {
                searchResults.innerHTML = `<p>Nenhum produto encontrado.</p>`;
                searchResults.style.display = 'block';
            }
            const addToCartButtons = searchResults.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', async function () {
                    const produtoId = this.getAttribute('data-id');
                    const produtoNome = this.getAttribute('data-nome');
                    if (!isUserLoggedIn()) {
                        resetAll();
                        location.assign('/frontend/cadastro.html');
                    }
                    else {
                        console.log(`Produto ${produtoId} (${produtoNome}) adicionado ao carrinho!`);
                        salvarProdutoNoLocalStorage({ id: produtoId, nome: produtoNome });
                    }
                });
            });
            const viewMoreButtons = searchResults.querySelectorAll('.view-more');
            viewMoreButtons.forEach(button => {
                button.addEventListener('click', async function () {
                    const produtoId = this.getAttribute('data-id');
                    console.log(`Ver mais informações sobre o produto ${produtoId}`);
                });
            });
        }
        catch (error) {
            console.error('❌ Erro ao buscar produtos:', error);
            alert('Erro ao buscar produtos. Verifique o console para mais detalhes.');
        }
    });
});
