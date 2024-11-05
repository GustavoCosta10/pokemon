let correctPokemon;
let options = [];
let score = 0; // Variável de pontuação

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 150) + 1; // Pega um Pokémon aleatório entre 1 e 150 (Geração 1)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para buscar quatro Pokémon aleatórios e embaralhar as opções
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    document.getElementById('pokemonImage').style.filter = 'brightness(0)'; // faz a imagem ficar preta
    options = [correctPokemon]; // Adiciona o Pokémon correto nas opções

    // Adiciona mais 3 Pokémon aleatórios nas opções
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
        }
    }

    // Embaralha as opções
    options.sort(() => Math.random() - 0.5);

    displayQuestion(); // Exibe a imagem e as opções de resposta
}

// Função para exibir a imagem do Pokémon e as opções de resposta
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default; // Exibe a imagem do Pokémon
    pokemonImage.style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    // Cria botões para cada uma das opções de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = capitalizeFirstLetter(option.name); // Nome do Pokémon
        button.onclick = () => checkAnswer(option);

        button.classList.add('pokemon-button');

        optionsDiv.appendChild(button);
    });
}

// Função para verificar se a resposta está correta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    document.getElementById('pokemonImage').style.filter = 'brightness(1)'; // faz a imagem ficar normal
    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        resultDiv.style.color = '#00FF00';
        updateScore(true); // Atualiza a pontuação
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
        resultDiv.style.color = '#DD211F';
        updateScore(false); // Atualiza a pontuação
    }

    document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"
}

// Função para atualizar a pontuação
function updateScore(isCorrect) {
    if (isCorrect) {
        score++;
    } else {
        score = Math.max(score - 1, 0); // Não deixa a pontuação ficar negativa
    }
    document.getElementById('scoreDisplay').textContent = score; // Atualiza a exibição da pontuação
}

// Quando o botão "Próximo" for clicado, gera uma nova pergunta
document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    generateQuestion(); // Gera uma nova pergunta
};

// Quando o botão "Zerar Pontuação" for clicado
document.getElementById('resetButton').onclick = () => {
    score = 0; // Zera a pontuação
    document.getElementById('scoreDisplay').textContent = score; // Atualiza a exibição da pontuação
    document.getElementById('result').innerHTML = '<p>Pontuação zerada!</p>'; // Mensagem de confirmação
};

// Função para capitalizar a primeira letra do nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Gera a primeira pergunta ao carregar a página
generateQuestion();