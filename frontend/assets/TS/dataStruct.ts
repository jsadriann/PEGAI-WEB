interface User {
    username: string;
    email: string;
    password: string;
}

interface Product {
    id: number;
    name: string;
    descricao: string;
    quantidade: number;
    user: { username: string };
    foto: { url: string };
}

interface userValidate {
    username: string,
    nome: string,
    sobrenome: string, 
    senha: string,
    confSenha: string
}

interface userResponse {
    id: number;
    attributes: {
      username: string;
      email: string;
      nome?: string;
      sobrenome?: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: any;
    };
}

interface uploadResponse {
    id: number;
    url: string;
    name: string;
}

interface produtoResponse {
    data: {
      id: number;
      attributes: {
        nome: string;
        descricao: string;
        quantidade: number;
        foto: UploadResponse;
      };
    };
}
