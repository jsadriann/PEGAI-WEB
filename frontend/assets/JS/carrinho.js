"use strict";
function salvarProdutoNoLocalStorage(produto) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    console.log(produto);
}
