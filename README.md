# 🚀 Desenvolvimento Back-End: CRUD & Consumo de APIs Externas com Node.js & TypeScript

Repositório dedicado à **evolução do meu aprendizado em desenvolvimento Back-End** como parte do curso de **Desenvolvimento Full Stack**.

Nesta segunda etapa, evoluí a aplicação para construir uma API REST completa com operações de **CRUD (Create, Read, Update, Delete)** para gerenciamento de dados na memória, além de integrar o servidor a uma **API externa (ViaCEP)** utilizando requisições assíncronas com `fetch` e regras de negócio condicionais.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática e segurança ao código.
- **Express.js**: Framework para criação de APIs e gerenciamento de rotas HTTP.
- **Fetch API / Async & Await**: Utilizado para consumo de serviços web externos.
- **tsx**: Executor TypeScript de alta performance para o ambiente de desenvolvimento.

---

## 🧠 Conceitos Aprendidos e Aplicados

Durante esta aula prática, aprofundei os seguintes conceitos:

### 1. Operações CRUD e Verbos HTTP
- **`GET`**: Leitura de dados cadastrados.
- **`POST`**: Criação de novos registros no sistema com envio de dados no corpo da requisição (`req.body`).
- **`PUT`**: Atualização pontual de registros existentes utilizando parâmetros da URL.
- **`DELETE`**: Remoção de itens do banco de dados simulado na memória.

### 2. Validações e Status Codes HTTP
- `200 OK`: Operação realizada com sucesso.
- `201 Created`: Novo recurso criado com sucesso.
- `400 Bad Request`: Requisição inválida (ex: ausência de campos obrigatórios como o nome do pet).
- `404 Not Found`: Registro ou endereço de CEP não localizado.

### 3. Integração com APIs Externas (Assincronismo)
- Consumo da API pública do **ViaCEP** utilizando `async/await` e `fetch`.
- Aplicação de **regras de negócio**: cálculo condicional de frete com base na localidade retornada pelo CEP.

---

## 📌 Rotas Criadas na API

### 🐶 Gerenciamento de Pets (CRUD)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/pets` | Retorna a lista de pets cadastrados. |
| `POST` | `/pets` | Cadastra um novo pet (requer campo `nome` no corpo JSON). |
| `PUT` | `/pets/:id` | Atualiza a idade do pet correspondente ao ID. |
| `DELETE`| `/pets/:id` | Remove o pet do sistema correspondente ao ID. |

### 📍 Endereço e Frete (Integração ViaCEP)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/endereco/:cep` | Busca o endereço completo a partir do CEP informado. |
| `GET` | `/frete/:cep` | Calcula o frete com base na cidade do CEP informado. |

---

## ⚙️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd "Desafio API"
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx tsx src/index.ts
   ```
   *(ou `npm run dev`, caso tenha configurado no seu package.json)*

5. **Exemplos de acesso:**
   - Listar Pets: `http://localhost:3000/pets`
   - Buscar CEP: `http://localhost:3000/endereco/50000000` *(Substitua pelo CEP desejado)*
   - Calcular Frete: `http://localhost:3000/frete/54310000`

---

✨ Desenvolvido por **Ricardo** durante as aulas de Desenvolvimento Full Stack.