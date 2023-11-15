document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    navegacionFija();
    crearGaleria();
    scrollNav();
}

function navegacionFija(){
    const barra = document.querySelector('.header');
    const body = document.querySelector('body');
    const sobreFestival = document.querySelector('.sobre-festival');

    window.addEventListener('scroll', function(){
        console.log(sobreFestival.getBoundingClientRect());

        if(sobreFestival.getBoundingClientRect().top < 0 ){
            barra.classList.add('fijo');
            body.classList.add('body-scroll');
        }else {
            body.classList.remove('fijo');
            barra.classList.remove('body-scroll');}
    });
}

function scrollNav(){
 
    const enlaces = document.querySelectorAll('.navegacion-principal .ban');
 
    enlaces.forEach( enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
          
           const seccionScroll = e.target.attributes.href.value; 
           const seccion = document.querySelector(seccionScroll);
           seccion.scrollIntoView({ behavior: "smooth"});
        });
    });
}

function crearGaleria(){
    const galeria = document.querySelector('.galeria-imagenes');
    
    for(let i = 1; i <=12 ; i++){

        const imagen = document.createElement('picture');

        imagen.innerHTML = `
         <source srcset="/static/build/img/thumb/${i}.avif" type="image/avif">
         <source srcset="/static/build/img/thumb/${i}.webp" type="image/webp"> 
             <img loading="lazy" width="200" height="300" src="/static/build/img/thumb/${i}.jpg" alt="galeria">`;
        imagen.onclick = function(){
            mostrarImagen(i);
        }
    
        galeria.appendChild(imagen);
    }

    function mostrarImagen(id){
        const imagen = document.createElement('picture');

        imagen.innerHTML = `
        <source srcset="/static/build/img/grande/${id}.avif" type="image/avif">
        <source srcset="/static/build/img/grande/${id}.webp" type="image/webp"> 
        <img loading="lazy" width="200" height="300" src="static/build/img/grande/${id}.jpg" alt="galeria">`;

        const overlay = document.createElement('DIV');
        overlay.appendChild(imagen);
        overlay.classList.add('overlay');
        overlay.onclick = function (){
            const body = document.querySelector('body');
            body.classList.remove('fijar-body');
            overlay.remove();
        }

        const body = document.querySelector('body');
        body.appendChild(overlay);
        body.classList.add('fijar-body');

        //pa cerrar el modal

        const close = document.createElement('P');
        close.textContent = 'X';
        close.classList.add('btn-cerrar');
        close.onclick = function(){
            const body = document.querySelector('body');
            body.classList.remove('fijar-body');
            overlay.remove();
        }
        overlay.appendChild(close);
    }
}
