const filmes = document.getElementById('lista')
const apiUrl = "http://localhost:3000/filmes";

let edicao = false;
let idEdicao = 0;

let nome = document.getElementById('nome');
let capa = document.getElementById('capa');
let genero = document.getElementById('genero');
let nota = document.getElementById('nota');

const clearFields = () => {
    nome.value = '';
    capa.value = '';
    genero.value = '';
    nota.value = '';
};

const getFilmes = async () => {
    const response = await fetch(apiUrl);
    const filmes = await response.json();
    filmes.map((filme) => {
        lista.insertAdjacentHTML('beforeend', `
        <div class="col">
            <div class="card">
                <img src="${filme.capa}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title">${filme.nome} </h4>
                        <h5 class="card-text">Genero: ${filme.genero}</h5>
                        <h5 class="card-text">Nota: ${filme.nota}</h5>
                        <div>
                            <button class="btn btn-primary" onclick="editFilme('${filme.id}')">Editar</button>
                            <button class="btn btn-danger"onclick="deleteFilme('${filme.id}')">Excluir</button>
                            <button class="btn btn-success">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                <label class="form-check-label" for="flexSwitchCheckDefault">Assistido</label>
                            </button>
                        </div>
                    </div>
            </div>
        </div>
        `)
    })
};

const getFilmeById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}

const deleteFilme = async (id) => {
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    });
    const response = await fetch(request);
    const result = await response.json();
    alert(result.message);
    lista.innerHTML = '';
    getFilmes();
};

const submitForm = async (event) => {
    event.preventDefault();
    const filme = {
        nome: nome.value,
        capa: capa.value,
        genero: genero.value,
        nota: nota.value
    }
    if(edicao) {
        putFilme(filme, idEdicao);
    } else {
        createFilme(filme);
    }
    clearFields();
    lista.innerHTML = '';
};

const createFilme = async(filme) => {
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(filme),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    const response = await fetch(request);
    const result = await response.json();
    alert(result.message);
    lista.innerHTML = '';
    getFilmes();
};



const editFilme = async (id) => {
    edicao = true;
    idEdicao = id;
    const filme = await getFilmeById(id);

    nome.value = filme.nome;
    capa.value = filme.capa;
    genero.value = filme.genero;
    nota.value = filme.nota;
    
};

const putFilme = async(filme, id) => {
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(filme),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    const response = await fetch(request);
    const result = await response.json();
    alert(result.message);
    edicao = false;
    idEdicao = 0;
    getFilmes();
};



getFilmes();