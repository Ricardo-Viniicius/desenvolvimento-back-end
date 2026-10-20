import express, { Request, Response} from 'express';

const app = express();
app.use(express.json());

// Banco de dados provisório
let bancoPets = [
    {id: 1, nome: "Rex", especie: "Cachorro", idade: 3}
];

// Rota para ler os dados
app.get('/pets', (req: Request, res:Response) =>{
    res.json(bancoPets);
});

// Rota criar dados 
app.post('/pets', (req: Request, res: Response) =>{
    const novoPet = req.body

    // Trava de segurança 
    if(!novoPet.nome){
        return res.status(400).json({erro: "O nome do pet é obrigatório"});
    }

    // Adiciona um novo pet
    bancoPets.push(novoPet)
    // retorna status (201)
    res.status(201).json({mensssagem: "Pet salvo com Sucesso e de froma Segura!"});
});

// Rota para atualização 
app.put('/pets/:id', (req: Request, res: Response) =>{
    const idUrl = Number(req.params.id);
    const petAlvo = bancoPets.find(p => p.id === idUrl);

    if(petAlvo){
        // Subistituindo a idade antiga pela atual no req.body
        petAlvo.idade = req.body.idade;
        res.json({mensagem: "Idade atualizada com Sucesso!"});
    } else{
        res.status(404).json({erro: "Pet não econtrado."});
    }
});

// Rota para exclusão
app.delete('/pets/:id', (req: Request, res: Response) =>{
    const idUrl = Number(req.params.id);

    bancoPets = bancoPets.filter(p => p.id !== idUrl);
    res.json({mensagem: "Pet adotado e removido do sistema!"}); 
}); 

// Fazendo integração com o API dos Correios (ViaCEP
//Codigo do Buscador (Fetch)
app.get('./endereco/:cep', async (req: Request, res: Response) =>{
    const cep = req.params.cep;

    // Vai no servidor ViaCEP e ESPERA (await) voltar com a resposta
    const respostaExterna = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    // Conversão do texto recebido para o JSON
    const dadosEndereco = await respostaExterna.json();
    // Devolvendo ao usuário o dado
    res.json(dadosEndereco);
});
//Calculadora de frete
app.get('/frete/:cep', async (req: Request, res: Response) => {
    const cep = req.params.cep;
    const resposta = await fetch( `https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    let valorFrete = "R$ 20,00";

    // Trava de segurança caso o CEP seja inexistente
    if(dados.erro){
        return res.status(404).json({
            mensagem: "CEP Inválido ou inexistente!"
        });
    }

    // Regra de negócio do exercicio proposto
    if(dados.localidade === "Jaboatão dos Guararapes"){
        valorFrete = "Grátis!";
    }
    res.json({cidade: dados.localidade, frete: valorFrete});
});


// Verificando se o servidor está rodando
app.listen(3000, () =>{
    console.log("Servidor Online na porta 3000!")
})
