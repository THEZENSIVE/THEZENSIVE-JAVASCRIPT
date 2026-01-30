document.addEventListener('DOMContentLoaded', () => {
  fetch('js/noticias.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('news-container');
      const fullNewsContainer = document.getElementById('full-news-container');

      data.noticias.forEach(noticia => {
        const card = document.createElement('div');
        card.classList.add('news-card');

        // Título antes de la imagen
        card.innerHTML = `
          <h3>${noticia.titulo}</h3>
          <img src="${noticia.imagen}" alt="${noticia.titulo}">
        `;

        container.appendChild(card);

        // Evento click en el título
        const title = card.querySelector('h3');
        title.addEventListener('click', () => {
          // Si ya está abierto la misma noticia → cerrar
          if (fullNewsContainer.dataset.currentId == noticia.id) {
            fullNewsContainer.classList.remove('show');
            fullNewsContainer.dataset.currentId = '';
            fullNewsContainer.innerHTML = '';
          } else {
            // Mostrar nueva noticia
            fullNewsContainer.innerHTML = `<p>${noticia.texto.replace(/\n/g, '<br>')}</p>`;
            fullNewsContainer.dataset.currentId = noticia.id;
            fullNewsContainer.classList.add('show');
          }
        });
      });
    })
    .catch(error => console.error('Error cargando noticias:', error));
});
