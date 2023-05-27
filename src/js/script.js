var characterRM;
var page = 1;
var dados = [];
var filterType = "name";
var element = [];
var characterVariants = [];
var variants = [];
this.teste = [];
this.persona = [];
this.totalpages = 0;
this.variantsCharacters = [];
this.listCharacters = document.getElementById('lista');
this.selectSearch = document.getElementById('selectSearch');
this.inputSearch = document.getElementById('inputSearch');
//Form change
document.getElementById("submitSearch").addEventListener("click", submitSearch);

rickGet(page);

/** Chamada de todos os dados */
function rickGet(page) {
	const query = `
		query {
			characters (page: ${page}, filter: {}) {
				info {
					pages
					count
				}
				results {
					id
					name
					species
					status
					image
				}
			}
		}
	`;
	fetch('https://rickandmortyapi.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query }),
	}).then(responseGET => responseGET.json())
		.then(dataGET => {
			this.totalpages = dataGET?.data.characters.info.pages;
			characterRM = dataGET.data.characters;
			if (characterRM) {
				listaCharacters(characterRM.results);
			}
			if (page === 1) {
				createPagination(this.totalpages);
			}

		})
		.catch(error => {
			console.error('Erro ao carregar os dados:', error);
			this.error = `
			<div class="col-12">
				<div class=''>
					<h2>Erro em carregar a lista tente novamente mais tarde</h2>
				</div>
			</div>
			`;
			this.listCharacters.innerHTML = this.error;
		});
}

/** Busca */
function submitSearch() {
	this.persona = [];
	this.selectSearch = document.getElementById('selectSearch');
	this.inputSearch = document.getElementById('inputSearch');
	if (this.selectSearch.value === 'status') {
		switch (this.inputSearch.value) {
			case "Viva":
			case "Vivo":
			case "vivo":
			case "viva":
				this.inputSearch.value = 'Alive';
				break;
			case "Morta":
			case "Morto":
			case "morto":
			case "morta":
				this.inputSearch.value = 'Dead';
				break;
			default:
				console.log('¡WUBBA LUBBA DUB DUB!');
		}
	}
	mortySearch(page, this.selectSearch.value, this.inputSearch.value);
}

function mortySearch(page, filterType, search) {
	const query = `query {
		characters(page: ${page}, filter: { ${filterType}: "${search}" }) {
			info {
				pages
				count
			}
			results {
				id
				name
				species
				status
				image
			}
		}
	}`;
	fetch('https://rickandmortyapi.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query }),
	}).then(response => response.json())
		.then(data => {
			this.totalpages = data.data.characters.info.pages;
			const searchQuery = data.data.characters.results;
			if (filterType === `status`) {
				if (search === `Alive` || search === `Dead`) {
					if (searchQuery) {
						listaCharacters(searchQuery);
					}
				} else {
					this.persona = `
					<div class="col-12">
						<div class=''>
							<h2>Status inválido, descubra se está vivo ou morto e tente novamente!</h2>
						</div>
					</div>
				`;
					this.listCharacters.innerHTML = this.persona;
				}

			} else {
				if (searchQuery) {
					listaCharacters(searchQuery);
				}
				if (page === 1) {
					createPagination(this.totalpages);
				}
			}
		})
		.catch(error => {
			console.error('Erro ao carregar os dados:', error);
			this.error = `
			<div class="col-12">
				<div class=''>
					<h2>Erro em carregar a lista tente novamente mais tarde</h2>
				</div>
			</div>
		`;
			this.listCharacters.innerHTML = this.error;
		});
}

/** Paginação */
function changePagination(total, page) {
	if (page < 1 || page > total) {
		return;
	}
	const paginaAtual = page;
	this.selectSearch = document.getElementById('selectSearch');
	this.inputSearch = document.getElementById('inputSearch');
	if (!this.inputSearch.value) {
		rickGet(paginaAtual);
	} else {
		mortySearch(paginaAtual, this.selectSearch.value, this.inputSearch.value);
	}
}

function createPagination(total) {
	const pageElement = document.getElementById('pagination');
	while (pageElement.firstChild) {
		pageElement.removeChild(pageElement.firstChild);
	}
	for (let i = 1; i <= total; i++) {
		if (i === 1) {
			const titleElement = document.createElement('h3');
			titleElement.className = 'py-4';
			titleElement.textContent = "Viaje pelas dimensões";
			pageElement.appendChild(titleElement);
		}
		const pagNumber = document.createElement('div');
		pagNumber.className = 'col-1 text-center pe-auto user-select-none';
		pagNumber.textContent = i;
		pagNumber.addEventListener('click', function () {
			changePagination(total, i);
		});
		pageElement.appendChild(pagNumber);
	}
}

/** Variantes */
async function alternativesGet(name) {
	const query = `query {
		characters(page: 1, filter: { name: "${name}" }) {
			info {
				pages
				count
			}
			results {
				name
			}
		}
	}`;
	try{
		const response = await fetch('https://rickandmortyapi.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query }),
		});
		const _data = await response.json();
		const total = _data.data.characters.info.pages;
		variants = [];
		if(total === 1){
			const pageSearch = _data.data.characters.results;
			variants = pageSearch.map(character => character.name);
		}else if(total > 1){
			for(i=1; i <= total; i++){
				try {
					const variant = await variantsGet(name, i);
					variants.push(variant);
				} catch (error) {
					console.error('Erro ao obter as variantes multiplas:', error);
					this.variantsCharacters.push([]);
				}
			}
		}
		return (variants);
	} catch (error){
		console.error('Erro ao carregar os dados:', error);
		return [];
	}
}

async function variantsGet(name, page) {
	const query = `query {
		characters(page: ${page}, filter: { name: "${name}" }) {
			results {
				name
			}
		}
	}`;
	try{
		const response = await fetch('https://rickandmortyapi.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query }),
		});
		const data = await response.json();
		element = data.data.characters.results;
		const pageSearch = data.data.characters.results;
		const variant = pageSearch.map(character => character.name);
		return (variant);
	}catch(error){
		console.error('Erro ao carregar os dados da página ' + page + ':', error);
		throw error;
	}
}

/** Lista de exibição */
async function listaCharacters(_data) {
	this.variantsCharacters = [];
	this.listCharacters.innerHTML = '';
	this.persona = [];
	if (_data != "") {
		for (let i = 0; i < _data.length; i++) {
			const nameS = _data[i].name.split(' ', 1);
			try {
			  const variants = await alternativesGet(nameS);
			  this.variantsCharacters.push(variants);
			} catch (error) {
			  console.error('Erro ao obter as variantes:', error);
			  this.variantsCharacters.push([]);
			}
		}
		for (var i = 0; i < _data.length; i++) {
			this.persona += `<div class="col-6 col-lg-3">
				<div class='py-2'>
					<img src="${_data[i].image}" class="img-fluid max-img" alt="" srcset="${_data[i].image}">
				</div>
				<div class='py-2'>
					<h2>${_data[i].name}</h2>
					<p><strong>Nome:</strong> ${_data[i].name}</p>
					<p><strong>Espécie:</strong> ${_data[i].species}</p>
					<p><strong>Status:</strong> ${_data[i].status}</p>
					<p><strong>Variantes:</strong> ${this.variantsCharacters[i]}</p>
				</div>
			</div>`;
		}
		this.listCharacters.innerHTML = this.persona;
	} else {
		this.persona = `<div class="col-12">
			<div class=''>
				<h2>Não foi encontrado seres vivos ou mortos nesta lista, tente novamente!</h2>
			</div>
		</div>`;
		this.listCharacters.innerHTML = this.persona;
	}
}