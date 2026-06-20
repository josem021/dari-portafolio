// 1. LISTA ESCALABLE DE IMÁGENES
const imagesList = [
    '01.jpg', 
    '02.jpg', 
    '03.jpg', 
    '04.jpg', 
    '05.jpeg', 
    '06.jpeg'
];

const baseFolder = './img/carrusel/';

// Elementos del DOM
const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('dotsContainer');

let currentIndex = 0;
let autoPlayInterval;
let imagesElements = []; 

// Función para inyectar imágenes con efecto blur
function loadImages() {
    track.innerHTML = ''; 
    imagesList.forEach((filename) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        const bgImg = document.createElement('img');
        bgImg.src = baseFolder + filename;
        bgImg.classList.add('slide-bg');
        
        const fgImg = document.createElement('img');
        fgImg.src = baseFolder + filename;
        fgImg.alt = 'Trabajo de maquillaje';
        fgImg.classList.add('slide-fg');
        
        slide.appendChild(bgImg);
        slide.appendChild(fgImg);
        track.appendChild(slide);
    });
    imagesElements = Array.from(track.children);
}

// Puntos de paginación
function setupPagination() {
    dotsContainer.innerHTML = ''; 
    imagesList.forEach(() => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
    });
}

function updatePagination() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.className = 'dot'; 
        const distance = Math.abs(index - currentIndex);
        if (distance === 0) dot.classList.add('active');
        else if (distance === 1) dot.classList.add('adjacent');
        else if (distance === 2) dot.classList.add('outer');
        else dot.classList.add('hidden');
    });
}

// Movimiento del carrusel
function moveToSlide(index) {
    if (index < 0) currentIndex = imagesElements.length - 1; 
    else if (index >= imagesElements.length) currentIndex = 0; 
    else currentIndex = index;
    
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updatePagination();
}

// --- LÓGICA DE TIEMPO INTELIGENTE ---
function startAutoPlay(duration = 6500) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
        // Si el ciclo es automático, volvemos a 6500ms
        if (duration !== 6500) startAutoPlay(6500);
    }, duration);
}

// Al interactuar: 7000ms, luego vuelve a 6500ms
function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay(7000); 
}

// --- GESTOS TÁCTILES (MOBILE) ---
let touchStartX = 0;
track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Solo si el arrastre es mayor a 50px
        if (diff > 0) moveToSlide(currentIndex + 1); // Izquierda
        else moveToSlide(currentIndex - 1); // Derecha
        resetAutoPlay();
    }
});

// Eventos de botones
prevBtn.addEventListener('click', () => { moveToSlide(currentIndex - 1); resetAutoPlay(); });
nextBtn.addEventListener('click', () => { moveToSlide(currentIndex + 1); resetAutoPlay(); });

// Inicialización
loadImages();
setupPagination();
updatePagination();
startAutoPlay();