var characterRM;
var page = 1;
var dados = [];
var filterType = "name";
var characterVariants = [];
this.persona = [];
this.totalpages = 0;
this.variantsCharecters = [];
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
				createPagination(this.totalpages, characterRM.results);
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
					createPagination(this.totalpages, searchQuery);
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

function createPagination(total, data) {
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
		const paginaElemento = document.createElement('div');
		paginaElemento.className = 'col-1 text-center pe-auto user-select-none';
		paginaElemento.textContent = i;
		paginaElemento.addEventListener('click', function () {
			changePagination(total, i);
		});
		pageElement.appendChild(paginaElemento);
	}
}

/** Variantes */
function alternativesGet(name, page) {
	this.variantsCharecters = [];
	const query = `query {
		characters(page: ${page}, filter: { name: "${name}" }) {
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
			const total = data.data.characters.info.pages;
			const variants = data.data.characters.results;
			variants.forEach(character => {
				if (total > 1) {
					for (let index = 1; index <= total; index++) {
						variantsGet(character.name, index);
					}
				} else {
					this.variantsCharecters.push(character.name);
				}
			});
			characterVariants = characterVariants.concat(this.variantsCharecters);
		})
		.catch(error => {
			console.error('Erro ao carregar os dados:', error);
		});
}

function variantsGet(name, page) {
	const query = `query {
		characters(page: ${page}, filter: { name: "${name}" }) {
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
	}
	).then(response => response.json())
		.then(data => {
			this.element = data.data.characters.results;
			console.log(this.element);
			this.element.forEach(name =>{
				this.variantsCharecters.push(name.name);
			});
			console.log(this.variantsCharecters);

		}).catch(error => {
			console.error('Erro ao carregar os dados:', error);
		});
}

/** Lista de exibição */
function listaCharacters(_data) {
	this.listCharacters.innerHTML = '';
	this.persona = [];
	if (_data != "") {
		for (var i = 0; i < _data.length; i++) {
			var teste = _data[i].name.split(" ", 1);
			teste = teste[0];
			alternativesGet(teste, page);
			console.log(teste);
			console.log(characterVariants);
			var variants = characterVariants.filter(name => _data[i].name.includes(teste) && name !== _data[i].name).join(", ");
			console.log(variants);
			this.persona += `<div class="col-6 col-lg-3">
				<div class='py-2'>
					<img src="${_data[i].image}" class="img-fluid max-img" alt="" srcset="${_data[i].image}">
				</div>
				<div class='py-2'>
					<h2>${_data[i].name}</h2>
					<p><strong>Nome:</strong> ${_data[i].name}</p>
					<p><strong>Espécie:</strong> ${_data[i].species}</p>
					<p><strong>Status:</strong> ${_data[i].status}</p>
					<p><strong>Variantes:</strong> </p>
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