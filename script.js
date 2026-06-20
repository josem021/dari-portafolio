// 1. LISTA ESCALABLE DE IMÁGENES
const imagesList = [
    '01.jpg', 
    '02.jpg', 
    '03.jpg', 
    '04.jpg', 
    '05.jpeg', 
    '06.jpeg'
];

// Ruta donde guardas las fotos
const baseFolder = './img/carrusel/';

// Elementos del DOM
const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('dotsContainer');

let currentIndex = 0;
let autoPlayInterval;
let imagesElements = []; 

// Función para inyectar las imágenes con el efecto blur de fondo
function loadImages() {
    track.innerHTML = ''; 
    
    imagesList.forEach((filename) => {
        // Contenedor principal de la foto
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        // Imagen de fondo (Borrosa)
        const bgImg = document.createElement('img');
        bgImg.src = baseFolder + filename;
        bgImg.classList.add('slide-bg');
        
        // Imagen principal (Nítida)
        const fgImg = document.createElement('img');
        fgImg.src = baseFolder + filename;
        fgImg.alt = 'Trabajo de maquillaje';
        fgImg.classList.add('slide-fg');
        
        // Ensamblaje
        slide.appendChild(bgImg);
        slide.appendChild(fgImg);
        track.appendChild(slide);
    });
    
    imagesElements = Array.from(track.children);
}

// Función para crear los puntos de Instagram
function setupPagination() {
    dotsContainer.innerHTML = ''; 
    imagesList.forEach(() => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
    });
}

// Lógica de tamaños estilo Instagram
function updatePagination() {
    const dots = dotsContainer.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.className = 'dot'; 
        
        const distance = Math.abs(index - currentIndex);
        
        if (distance === 0) {
            dot.classList.add('active'); 
        } else if (distance === 1) {
            dot.classList.add('adjacent'); 
        } else if (distance === 2) {
            dot.classList.add('outer'); 
        } else {
            dot.classList.add('hidden'); 
        }
    });
}

// Movimiento del carrusel
function moveToSlide(index) {
    if (index < 0) {
        currentIndex = imagesElements.length - 1; 
    } else if (index >= imagesElements.length) {
        currentIndex = 0; 
    } else {
        currentIndex = index;
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    updatePagination();
}

// Autoplay
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
    }, 6500);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Eventos de botones
prevBtn.addEventListener('click', () => {
    moveToSlide(currentIndex - 1);
    resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
    moveToSlide(currentIndex + 1);
    resetAutoPlay();
});

// Inicialización de todo el proceso
loadImages();
setupPagination();
updatePagination();
startAutoPlay();