const characterId = document.getElementById('characterId');
const characterName = document.getElementById('characterName');
const btnGo = document.getElementById('btn-go');
const btnReset = document.getElementById('btn-reset');
const content = document.getElementById('content');
const image = document.getElementById('img');
const conteinerResult = document.getElementById('result-style');

const fetchApiId = (value) => {
    return fetch(`https://rickandmortyapi.com/api/character/${value}`)
        .then((res) => res.json());
}

const fetchApiName = (value) => {
    return fetch(`https://rickandmortyapi.com/api/character/?name=${value}`)
        .then((res) => res.json());
}

const keys = ['name', 'status', 'species', 'gender', 'origin', 'episode'];
const newKeys = {
    name: 'Nome',
    status: 'Status',
    species: 'Espécie',
    gender: 'Gênero',
    origin: 'Planeta de origem',
    episode: 'Episódios'
};

const buildResult = (result) => {
    return keys.map((key) => document.getElementById(key))
        .map((elem) => {
            if (elem.checked && Array.isArray(result[elem.name])) {
                const arrayResult = result[elem.name].join('\r\n');
                const newElem = document.createElement('p');
                newElem.innerHTML = `${newKeys[elem.name]} : ${arrayResult}`;
                content.appendChild(newElem);
            } else if (elem.checked && elem.name === 'origin') {
                const newElem = document.createElement('p');
                newElem.innerHTML = `${newKeys[elem.name]} : ${result[elem.name].name}`;
                content.appendChild(newElem);
            } else if (elem.checked && typeof (result[elem.name]) !== 'object') {
                const newElem = document.createElement('p');
                newElem.innerHTML = `${newKeys[elem.name]} : ${result[elem.name]}`;
                content.appendChild(newElem);
            }
        });
}

btnGo.addEventListener('click', async (event) => {
    event.preventDefault();
    let result = null;

    if (characterId.value === '' && characterName.value === '') {
        return content.innerHTML = 'É necessário fazer um filtro.';
    }

    if (characterId.value !== '') {
        try {
            result = await fetchApiId(characterId.value);
        } catch (err) {
            return content.innerHTML = "Personagem não encontrado por ID.";
        }
    } else if (characterName.value !== '') {
        try {
            const response = await fetchApiName(characterName.value);
            if (response.results && response.results.length > 0) {
                result = response.results[0]; // pega o primeiro personagem retornado
            } else {
                return content.innerHTML = 'Personagem não encontrado pelo nome.';
            }
        } catch (err) {
            return content.innerHTML = 'Erro ao buscar personagem pelo nome.';
        }
    }

    // Agora sim, com result garantido, renderiza
    if (content.firstChild === null) {
        conteinerResult.className = 'result-style';
        image.src = `${result.image}`;
        buildResult(result);
    } else {
        content.innerHTML = '';
        conteinerResult.className = 'result-style';
        image.src = `${result.image}`;
        buildResult(result);
    }
});

btnReset.addEventListener('click', () => location.reload());
