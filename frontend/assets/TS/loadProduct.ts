async function loadProducts(): Promise<void> {
    const main = document.getElementById('main') as HTMLElement;
    main.innerHTML = '';

    try {
        const response = await api.get('/produtos', {
            params: {
                populate: ['user','foto'],  // Povoar fotos
            },
        });

        console.log('Produtos recebidos:', response.data);

        const products = response.data.data;

        if (!products || !Array.isArray(products)) {
            throw new Error('Estrutura inesperada da resposta da API');
        }

        
        const productList = document.createElement('div');
        productList.classList.add('product-list');
        main.appendChild(productList); 


        products.forEach((product) => {
            console.log('Produto:', product);

            const { id, nome = 'Nome indisponível', descricao = 'Sem descrição', quantidade = 0, user, foto } = product;
            const userName = user?.username
            const fotoUrl = foto?.[0]?.url || 'placeholder.jpg';

            // Criação do card do produto
            const productCard = document.createElement('div');
            productCard.classList.add('product-item');
            
            // Criação da imagem do produto
            const productImage = document.createElement('img');
            productImage.src = `http://localhost:1337${fotoUrl}`;
            productImage.alt = nome;

            // Criação da seção de detalhes do produto
            const productDetails = document.createElement('div');
            productDetails.classList.add('product-details');

            const productName = document.createElement('h3');
            productName.textContent = nome;

            const productDescription = document.createElement('p');
            productDescription.classList.add('short-description');
            productDescription.textContent = descricao.substring(0, 100) + '...';

            const productQuantity = document.createElement('p');
            productQuantity.textContent = `Quantidade: ${quantidade}`;

            const productOwner = document.createElement('p');
            productOwner.textContent = `Proprietário: ${userName}`;

            // Criação do botão "Adicionar ao Carrinho"
            const addToCartBtn = document.createElement('button');
            addToCartBtn.classList.add('add-to-cart-btn');
            addToCartBtn.dataset.id = id.toString();
            addToCartBtn.textContent = 'Adicionar ao Carrinho';

            // Função para o botão "Adicionar ao Carrinho"
            addToCartBtn.addEventListener('click', () => {
                if(localStorage.getItem('token') == null){
                    alert('Você será redirecionado para a pagina de login');
                    location.assign('/frontend/cadastro.html');
                }else{
                    salvarProdutoNoLocalStorage({documentId:product.documentId, id: product.documentId, nome: nome });
                    console.log(`Produto ${product.documentId} adicionado ao carrinho!`);
                    alert(`Produto ${nome} adicionado ao carrinho!`);
                }
            });

            // Montando o produto
            productDetails.appendChild(productName);
            productDetails.appendChild(productDescription);
            productDetails.appendChild(productQuantity);
            productDetails.appendChild(productOwner);
            productDetails.appendChild(addToCartBtn);

            productCard.appendChild(productImage);
            productCard.appendChild(productDetails);

            
            productList.appendChild(productCard);
        });
    } catch (error: any) {
        console.error('Erro ao carregar produtos:', error.response?.data || error);
        main.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
