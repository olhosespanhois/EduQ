var characterRM;
var variantsCharecters = [];
var page = 1;
this.totalpages = 0;
var pageItens = 20;
var dados = [];
var fiterType = "name";
this.persona = [];
this.listCharacters = document.getElementById('lista');
this.selectSearch = document.getElementById('selectSearch');
this.inputSearch = document.getElementById('inputSearch');
//Form change
document.getElementById("submitSearch").addEventListener("click", submitSearch);

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
	})
		.then(responseGET => responseGET.json())
		.then(dataGET => {
			this.totalpages = dataGET?.data.characters.info.pages;
			characterRM = dataGET.data.characters;
			if (characterRM) {
				listaCharacters(characterRM.results);
			}
			if(page===1){
				pagination(page, characterRM.results);
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
	if(this.selectSearch.value === 'status'){
		switch(this.inputSearch.value) {
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

function mortySearch(page, fiterType, search) {
	const query = `query {
		characters(page: ${page}, filter: { ${fiterType}: "${search}" }) {
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
		if(fiterType === `status`){
			if(search === `Alive` || search === `Dead`) {
				if (searchQuery) {
					listaCharacters(searchQuery);
				}
			}else{
				this.persona = `
					<div class="col-12">
						<div class=''>
							<h2>Status inválido, descubra se está vivo ou morto e tente novamente!</h2>
						</div>
					</div>
				`;
				this.listCharacters.innerHTML = this.persona;
			}

		}else{
			if (searchQuery) {
				listaCharacters(searchQuery);
			}
		}
		if(page===1){
			pagination(page, searchQuery);
			createPagination(this.totalpages, searchQuery);
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
function pagination(page, data) {
	console.log(page);
	console.log(data);
	const inicio = (page - 1) * 20;
  	const fim = inicio + 20;
  	const itensPagina = data.slice(inicio, fim);
	console.log(itensPagina);
	listaCharacters(itensPagina);
	//return itensPagina;
}

function changePagination(total, page, data){
	console.log(total);
	console.log(page);
	console.log(data);
	if (page < 1 || page > total) {
		return;
	}
	const paginaAtual = page;
	console.log(paginaAtual);
  	//const itensPagina = paginar(dados, itensPorPagina, paginaAtual);
  	pagination(page, data);
}

function createPagination(total, data) {
	const pageElement = document.getElementById('pagination');
	let page = 0;
	// Limpa os elementos de páginação existentes
	while (pageElement.firstChild) {
	  pageElement.removeChild(pageElement.firstChild);
	}
  
	// Cria os elementos de páginação
	for (let i = 1; i <= total; i++) {
	  const paginaElemento = document.createElement('div');
	  paginaElemento.className='col-1';
	  paginaElemento.textContent = i;
  
	  // Adiciona um manipulador de evento para chamar a função mudarPagina ao clicar na página
	  paginaElemento.addEventListener('click', function () {
		changePagination(total,i,data);
	  });
  
	  pageElement.appendChild(paginaElemento);
	}
  }

/** Variantes */
function alternativesGet(name, page) {
	const nome = name;
	const variante = [];
	const query = `query {
		characters(page: ${page}, filter: { name: "${nome}" }) {
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
			//console.log(total);
			variants.forEach(character => {
				//console.log(character.name);
				if(total > 1){
					for (let index = 1; index <= total; index++) {
						let element = variantsGet(character.name, index);
						//console.log(element);
					}
					variantsGet(character.name, page++);
				}else{
					variantsCharecters.push(character.name);
				}
				// for (let index = 1; index <= total; index++) {
				// 	const element = variantsGet(character.name, index);
				// 	console.log(element);
				// }
			});
			return variantsCharecters;
			/*variants.forEach(character => {
				variante.push(character.name)
				console.log(variante);
			});*/
	})
	.catch(error => {
			console.error('Erro ao carregar os dados:', error);
	});
}

function variantsGet(name, page){
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
		//console.log(data.data.characters.results);
		const vari = data.data.characters.results;
		vari.forEach(character => {
			// 	console.log(character);
		});
		return data.data.characters.results;
	}).catch(error => {
		console.error('Erro ao carregar os dados:', error);
	});
}

/** Lista de exibição */
function listaCharacters(_data){
	this.listCharacters.innerHTML = '';
	this.persona = [];
	if(_data != ""){
		for (var i = 0; i < _data.length; i++) {
			const teste = _data[i].name.split(" ", 1);
			//alternativesGet(teste, page);
			//console.log(variantsCharecters);
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
	}else{
		this.persona = `<div class="col-12">
			<div class=''>
				<h2>Não foi encontrado seres vivos ou mortos nesta lista, tente novamente!</h2>
			</div>
		</div>`;
		this.listCharacters.innerHTML = this.persona;
	}
}

rickGet(page);