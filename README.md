# :checkered_flag: Pegaí Universitário

O Pegaí é um projeto que visa promover a economia colaborativa e o apoio mútuo entre estudantes. Por meio da plataforma, qualquer estudante pode cadastrar itens que estão dispostos a emprestar, tornando-os visíveis para colegas que possam necessitar desses equipamentos.



## :technologist: Membros da equipe

José Adrian Nascimento Silva - Engenharia da Computação - 475594

## :bulb: Objetivo Geral

O projeto é voltado para facilitar o acesso a recursos como materiais de estudo, ferramentas, dispositivos eletrônicos e outros itens que frequentemente são usados durante o curso, mas podem ser inacessíveis para alguns devido a restrições financeiras ou disponibilidade imediata.

## :eyes: Público-Alvo

Estudantes Universitários

## :star2: Impacto Esperado

Incentivar a criação de uma rede solidária onde estudantes possam ajudar uns aos outros, compartilhando recursos de forma voluntária, proporcionando acesso a equipamentos e materiais para quem não possui condição financeira ou intenção de comprar materiais que possam ter proveito curto. O projeto também visa diminuir a evazão de estudantes justamente por não terem condições de comprar equipamentos que são indispensaveis para a conclusão do curso.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

O sistema contará com três tipos de usuário: Estudante, Administrador e Usuário não logado.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

### Funcionalidades Acessíveis a Todos os Usuários (Usuários Não Logados)

1. Visualização de informações sobre o objetivo da plataforma e como funciona.

2. Pesquisar itens disponíveis, visualizar categorias, e listagem de itens.
3. Permitir a criação de conta(entidade Estudante) ou realizar login.
4. Permitir acesso a uma página para tirar dúvidas ou pedir ajuda em relação a plataforma.

### Funcionalidades Exclusivas para Usuários Logados (Estudantes)

1. Cadastro de Equipamentos:
   * Permitir o registro de itens para empréstimo, incluindo nome, descrição, disponibilidade, quantidade e condições de uso.
2. Solicitação de Empréstimo:
   * Solicitar o empréstimo de equipamentos. 
3. Gestão de Itens:
   * Visualizar, editar ou remover equipamentos cadastrados.
4. Carrinho:
   * Permitir que o Estudante adicione itens de seu interesse em uma lista de empréstimo.
5. Painel do Usuário:
   * Histórico de empréstimos realizados e recebidos.
   * Status atual dos itens emprestados (disponível, emprestado, em devolução).
   * Status atual de itens recebidos (tempo restande para devolução)
   * Atualização de informações pessoais.
   * Solicitação de remoção de conta. 
6. Avaliações:
   * Avaliar o comportamento de outros usuários após uma transação (empréstimo ou devolução).

### Funcionalidades Exclusivas para Usuários Logados (Administrador)

1. Gestão de Usuários:
   * Visualizar e gerenciar o cadastro de estudantes.
   * Adicionar cadastro de novos Administradores.
   * Bloquear ou suspender contas em caso de uso indevido da plataforma.
2. Moderação de Conteúdo:
   * Aprovar e editar itens cadastrados pelos estudantes.
   * Remover itens cadastrados por violação das diretrizes da plataforma.
3. Painel de Relatórios:
   * Visualizar estatísticas da plataforma, como:
     * Número de itens cadastrados
     * Transações realizadas.
     * Usuários ativos.
     * Nível de satisfação de usuários.
4. Configuração da Plataforma:
   * Ajustar categorias, diretrizes ou textos exibidos na página pública. 

## :spiral_calendar: Entidades ou tabelas do sistema

### 1. Usuário
| **Atributo**         | **Descrição**                                            |
|-----------------------|---------------------------------------------------------|
| ID do usuário         | Identificador único do usuário.                         |
| Nome                 | Nome completo do usuário.                                |
| E-mail               | Endereço de e-mail para login e contato.                 |
| Senha                | Senha criptografada para autenticação.                   |
| Tipo de usuário      | Define o perfil: administrador.(true, false)                 |
| Data de cadastro     | Data em que o usuário foi registrado no sistema.         |

### 2. Equipamento

| **Atributo**           | **Descrição**                                             |
|-------------------------|----------------------------------------------------------|
| **ID do equipamento**  | Identificador único do equipamento.                      |
| **Nome do equipamento**| Nome descritivo do equipamento.                         |
| **Descrição**          | Informações adicionais sobre o equipamento.             |
| **Categoria**          | Categoria do item (ex.: eletrônicos, livros).            |
| **Condição**           | Estado do equipamento (ex.: novo, usado).                |
| **Quantidade total**   | Quantidade total disponível no inventário do proprietário.|
| **Quantidade disponível** | Quantidade que ainda pode ser emprestada.             |
| **Status**             | Atualizado com base na quantidade disponível: |
|                         | - **Disponível:** Quando a quantidade disponível > 0.   |
|                         | - **Indisponível:** Quando a quantidade disponível = 0. |
| **Data de cadastro**   | Data de registro do equipamento no sistema.              |
| **Proprietário**       | Referência ao usuário que cadastrou o equipamento.       |

### 3. Solicitação de Empréstimo
| **Atributo**          | **Descrição**                                            |
|------------------------|---------------------------------------------------------|
| ID da solicitação     | Identificador único da solicitação.                     |
| Equipamento solicitado | Referência à entidade **Equipamento**.                 |
| Solicitante           | Referência ao usuário que solicitou o item.             |
| Proprietário          | Usuário proprietário do item solicitado.                |
| Data da solicitação   | Data em que o pedido foi feito.                         |
| Status da solicitação | Situação atual (pendente, aprovada, rejeitada).         |

### 4. Transação de Empréstimo
| **Atributo**          | **Descrição**                                            |
|------------------------|---------------------------------------------------------|
| ID da transação       | Identificador único da transação.                       |
| Equipamento emprestado| Referência à entidade **Equipamento**.                  |
| Solicitante           | Referência ao usuário que recebeu o empréstimo.         |
| Proprietário          | Usuário que realizou o empréstimo.                      |
| Data de início        | Data de início do empréstimo.                           |
| Data prevista para devolução | Data combinada para devolução do item.           |
| Status               | Estado da transação (ativa, concluída, atrasada).        |

### 5. Categoria
| **Atributo**          | **Descrição**                                            |
|------------------------|---------------------------------------------------------|
| ID da categoria       | Identificador único da categoria.                       |
| Nome da categoria     | Nome descritivo da categoria.                           |

### 6. Avaliação
| **Atributo**          | **Descrição**                                            |
|------------------------|---------------------------------------------------------|
| ID da avaliação       | Identificador único da avaliação.                       |
| Usuário avaliador     | Referência ao usuário que realizou a avaliação.         |
| Usuário avaliado      | Referência ao usuário avaliado.                         |
| Nota                 | Avaliação : 1 a 5 estrelas                |
| Comentário           | Feedback textual do avaliador.                           |
| Data da avaliação     | Data em que a avaliação foi feita.                      |


----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.

**Backend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Entidade 1 | X |  X  |  | X |
| Entidade 2 | X |    |  X | X |
| Entidade 3 | X |    |  |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/entidade1/|
| POST | api/entidade2 |


## header
  logo | menus| pesquisar | button login/ou button para perfil de usuario caso esteja logado

1. logo:
   * Pegai transparente e link pra home
  
3. header background:
   * primary-color

4. menus:
   * categorias, menu suspenso que ira mostrar a categoria dos produtos
   * perto de você, menu que irá listar itens da mesma cidade ou região
   * suporte, menu que ira abrir um formulario para entrar em contato com o suporte
   * sobre, menu que terá uma breve descrição sobre o projeto e seu proprosito
  
5. pesquisar:
   * um input que quando em focus irá cubrir o menu e de acordo com o ato de digitar irá abrir um modal
  com itens correspondentes com a pesquisa.

6. button usuario:
   * um botão que inicialmente será de login/cadastro mas que depois do usuario logar o botão irá ter seu
  estilo alterado para mostrar o avatar do usuario e logo do lado seu username. O botão por sua vez, ao ser
  clicado irá abrir o painel de usuario.

