rickGet();
// mortySearch();

function rickGet(){
	var characterRM;
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
	.then(response => response.json())
	.then(data => {
		characterRM = data.data.characters;
		const characters = data.data.characters.results;
    	// Exibir a lista de personagens
		characters.forEach(character => {
			console.log(character);
		});
		console.log(characterRM);

		if(characterRM){
			carouselRM(characterRM.results);
		}
	})
	.catch(error => {
		console.error('Erro ao carregar os dados:', error);
	});
}
function mortySearch(){

}

function carouselRM(data){
	console.log(data);
	this.classcarousel = document.getElementById('carouselInner');
	this.prod=``;
	for (var i = 0; i < data.length; i++) {
		this.prod += `
		<div class='carousel-item ${i == 0? 'active' : ''}'>
			<div class='row px-4 px-lg-5'>
				<div class='col-12 col-md-6'>
					<img src="${data[i].image}" class="img-fluid max-img" alt="" srcset="${data[i].image}">
				</div>
				<div class='col-12 col-md-6'>
					<h2>${data[i].name}</h2>
					<p><strong>Nome:</strong> ${data[i].name}</p>
					<p><strong>Espécie:</strong> ${data[i].species}</p>
					<p><strong>Status:</strong> ${data[i].status}</p>
				</div>
			</div>
		</div>`;
	}
	this.classcarousel.innerHTML = this.prod;
}

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