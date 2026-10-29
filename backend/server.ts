import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();

// 1. Configurações e MiddleWares
app.use(cors());
app.use(express.json());

// 2. Tipagens e Banco de dados 
interface Pet{
    id: string,
    nome: string,
    raca: string,
    idade: number
}

let pets: Pet[] = [];

// Rotas para o CRUD

// 3. Rota de listagem (GET) - Retorno de todos os pets
app.get('/pets',(req,res) =>{
    res.json(pets);
});

//4. Rota de Cadastro (POST) - Adiciona um novo Pet
app.post('/pets', (req,res) =>{
    const {nome, raca, idade} = req.body;

    const novoPet: Pet ={ 
        id: crypto.randomUUID(),
        nome,
        raca,
        idade
    };
    pets.push(novoPet);
    res.status(201).json(novoPet);
});

// 5. Rota de Atualização (PUT) - Altera os dados do pet existente
app.put('/pets/:id', (req, res) =>{
    const {id} = req.params;
    const {nome,raca,idade} = req.body;

    const petIndex = pets.findIndex(pet => pet.id === id);
    const petAtual = pets[petIndex];
 
    if(!petAtual){
        return res.status(404).json({erro: ' Pet não encontrado no sistema.'});
    };

    pets[petIndex] = {
        ...petAtual,
        nome: nome ?? petAtual.nome,
        raca: raca ?? petAtual.raca,
        idade: idade ?? petAtual.idade
    };
    res.json(pets[petIndex]);
});

// 6. Rota de exclusão (DELETE) - Remove o pet após uma adoção
app.delete('/pets/:id', (req,res) =>{
    const {id} = req.params;
    const petIndex = pets.findIndex(pet => pet.id === id);

    if(petIndex === -1){
        return res.status(404).json({erro: 'Pet não encontrado!'});
    };

    // Remove 1 item a partir do indice encontrado
    pets.splice(petIndex,1);
    res.status(204).send(); //Deletado com sucesso!
});

// ==========================================
// ROTA DE API EXTERNA (VIACEP)
// ==========================================

// 7. Rota de Cálculo de Entrega/Táxi Dog usando o ViaCEP
app.get('/frete/:cep', async (req,res) =>{
    const {cep} = req.params

    try{
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if(dados.erro){
            return res.status(404).json({erro: 'CEP inválido ou inexistente.'});
        }

        // Regra de negócio
        let valorFrete = 'R$ 30,00';
        if (dados.localidade === 'Jaboatão dos Guararapes'){
            valorFrete = 'Grátis';
        }

        res.json({
            cidade: dados.localidade,
            bairro: dados.bairro,
            uf:dados.uf,
            valor_frete: valorFrete
        });
    } catch (erro){
        res.status(500).json({erro: 'Falha ao se comunicar com o API do ViaCEP.'});
    };
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API do Grau Petshop rodando na porta ${PORT}`);
});