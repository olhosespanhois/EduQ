var characterRM;
var variantsCharecters = [];
var page = 1;
var totalpages = 0;
var fiterType = "name";
this.persona = [];
this.listCharacters = document.getElementById('lista');
this.selectSearch = document.getElementById('selectSearch');
this.inputSearch = document.getElementById('inputSearch');
//Form change
document.getElementById("submitSearch").addEventListener("click", submitSearch);

/** Chamada de todos os dados */
function rickGet() {
	console.log('Start');
	const query = `
		query {
			characters {
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
			totalpages = dataGET?.data.characters.info.pages;
			characterRM = dataGET.data.characters;
			// const characters = dataGET.data.characters.results;
			// characters.forEach(character => {
			// 	console.log(character);
			// });
			//console.log(characterRM);
			//mortySearch(totalpages);
			if (characterRM) {
				listaCharacters(characterRM.results);
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
		if(this.inputSearch.value === 'Alive' || this.inputSearch.value === 'Dead'){
			mortySearch(page, this.selectSearch.value, this.inputSearch.value);
		}else{
			this.persona = `<div class="col-12">
				<div class=''>
					<h2>Status inválido, descubra se está vivo ou morto e tente novamente!</h2>
				</div>
			</div>`;
			this.listCharacters.innerHTML = this.persona;
		}

	}else{
		mortySearch(page, this.selectSearch.value, this.inputSearch.value);
	}
	
}

function mortySearch(page, fiterType, search) {
	console.log('Busca');
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
	console.log(query);
	fetch('https://rickandmortyapi.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query }),
	}).then(response => response.json())
	.then(data => {
		const searchQuery = data.data.characters.results;
		if (searchQuery) {
			listaCharacters(searchQuery);
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
function pagination(total) {

}

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

function listaCharacters(_data){
	this.listCharacters.innerHTML = '';
	this.persona = [];
	if(_data != ""){
		for (var i = 0; i < _data.length; i++) {
			const teste = _data[i].name.split(" ", 1);
			alternativesGet(teste, page);
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

rickGet();







//modelo search

// query {
// 	characters(page: 1, filter: { name: "rick" }) {
// 	  info {
// 		pages
// 		count
// 	  }
// 	  results {
// 		id
// 		name
// 		status
// 		species
// 		type
// 		gender
// 		image
// 	  }
// 	}
// 	location(id: 1) {
// 	  id
// 	}
// 	episodesByIds(ids: [1, 2]) {
// 	  id
// 	}
//   }

// All get
// query {
//     characters {
//       info {
//         pages
//         count
//       }
//       results {
//         id
//         name
//         species
//         status
//         image
//       }
//     }
//   }