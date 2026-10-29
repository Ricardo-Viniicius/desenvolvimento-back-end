import { useState, useEffect } from "react";

interface Pet {
  id: string;
  nome: string;
  raca: string;
  idade: number;
}

function App() {
  const [listaPets, setListaPets] = useState<Pet[]>([]);

  // Estados para os campos do formulário
  const [nomeNovo, setNomeNovo] = useState('');
  const [racaNova, setRacaNova] = useState('');
  const [idadeNova, setIdadeNova] = useState('');
  const [petEmEdicaoId, setPetEmEdicaoId] = useState<string | null>(null);
  const [idadeEmEdicao, setIdadeEmEdicao] = useState('');

  // Estados para o CEP e o resultado do frete
  const [cepConsulta, setCepConsulta] = useState('');
  const [resultadoFrete, setResultadoFrete] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/pets')
      .then(resposta => resposta.json())
      .then(dadosDaApi => setListaPets(dadosDaApi))
      .catch(err => console.error("Erro ao buscar pets:", err));
  }, []);

  function cadastrarPet() {
    if (!nomeNovo || !racaNova || !idadeNova) {
      alert("Preencha todos os campos do pet!");
      return;
    }

    fetch('http://localhost:3000/pets', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        nome: nomeNovo,
        raca: racaNova,
        idade: Number(idadeNova)
      })
    })
      .then(res => res.json())
      .then(() => window.location.reload())
      .catch(err => console.error("Erro ao cadastrar:", err));
  };

  function excluirPet(id: string) {
    fetch(`http://localhost:3000/pets/${id}`, {
      method: 'DELETE'
    })
      .then(() => window.location.reload())
      .catch(err => console.error("Erro ao excluir:", err));
  };

  function atualizarIdade(id: string) {
    const idade = Number(idadeEmEdicao);
    if (!idadeEmEdicao || !Number.isInteger(idade) || idade < 0) {
      alert("Digite uma idade válida.");
      return;
    }

    fetch(`http://localhost:3000/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idade })
    })
      .then(async resposta => {
        if (!resposta.ok) {
          throw new Error(`A API respondeu com status ${resposta.status}.`);
        }

        const petAtualizado: Pet = await resposta.json();
        setListaPets(pets => pets.map(pet => pet.id === id ? petAtualizado : pet));
        setPetEmEdicaoId(null);
        setIdadeEmEdicao('');
      })
      .catch(err => {
        console.error("Erro ao atualizar idade:", err);
        alert("Não foi possível atualizar a idade do pet.");
      });
  };

  function consultarFrete() {
    if (!cepConsulta) return;

    fetch(`http://localhost:3000/frete/${cepConsulta}`)
      .then(res => res.json())
      .then(dados => {
        if (dados.erro) {
          setResultadoFrete(dados.erro);
        } else {
          setResultadoFrete(`Cidade: ${dados.cidade} - Frete: ${dados.valor_frete}`);
        }
      })
      .catch(() => setResultadoFrete("Erro ao consultar o frete."));
  }

  return (
    <div className="container mt-5">
      <h1>Adoção Grau Petshop</h1>

      {/* Listagem de Pets */}
      {listaPets.map(pet => (
        <div className="card mb-3 p-3" key={pet.id}>
          <h4>{pet.nome}</h4>
          <p>{pet.raca} - {pet.idade} anos</p>
          {petEmEdicaoId === pet.id && (
            <input
              type="number"
              min="0"
              step="1"
              className="form-control mb-2"
              aria-label={`Nova idade de ${pet.nome}`}
              value={idadeEmEdicao}
              onChange={e => setIdadeEmEdicao(e.target.value)}
            />
          )}

          <div>
            <button 
              className="btn btn-danger me-2" 
              onClick={() => excluirPet(pet.id)}
            >
              Adotado! (Excluir)
            </button>
            {petEmEdicaoId === pet.id ? (
              <>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => atualizarIdade(pet.id)}
                >
                  Salvar idade
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setPetEmEdicaoId(null);
                    setIdadeEmEdicao('');
                  }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="btn btn-warning me-2"
                onClick={() => {
                  setPetEmEdicaoId(pet.id);
                  setIdadeEmEdicao(String(pet.idade));
                }}
              >
                Editar Idade
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Formulário de Cadastro */}
      <div className="card p-3 mb-4">
        <h4>Novo Pet</h4>
        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Nome"
          value={nomeNovo}
          onChange={e => setNomeNovo(e.target.value)} 
        />

        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Raça"
          value={racaNova}
          onChange={e => setRacaNova(e.target.value)} 
        />

        <input 
          type="number" 
          className="form-control mb-2" 
          placeholder="Idade"
          value={idadeNova}
          onChange={e => setIdadeNova(e.target.value)} 
        />

        <button className="btn btn-primary" onClick={cadastrarPet}>Salvar</button>
      </div>

      {/* Consulta de Frete */}
      <div className="card p-3 bg-light border-warning">
        <h4>Consultar Frete de Ração</h4>
        <input 
          className="form-control mb-2" 
          placeholder="Digite o CEP"
          value={cepConsulta}
          onChange={e => setCepConsulta(e.target.value)} 
        />

        <button className="btn btn-warning" onClick={consultarFrete}>Calcular</button>
        <h5 className="mt-3 text-success">{resultadoFrete}</h5>
      </div>
    </div>
  );
}

export default App;