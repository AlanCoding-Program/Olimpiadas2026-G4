const contenedor = document.querySelector(".carrusel-contenedor");
const imagenes = document.querySelectorAll(".imagen");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");

let indice = 0;
setInterval(() => {
    indice++;
    if (indice >= imagenes.length)
    {
        indice = 0;
    }
    contenedor.style.transform = `translateX(-${indice * 100}%)`;
}, 3000);
/*preguntas*/
document.querySelectorAll('.box-questions').forEach(details => {
    const summary = details.querySelector('summary');

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (!details.hasAttribute('open')) {
        details.setAttribute('open', '');

        requestAnimationFrame(() => {
          details.classList.add('abierto');
        });
      } else {
        details.classList.remove('abierto');

        setTimeout(() => {
          details.removeAttribute('open');
        }, 300);
      }
    });
  });
