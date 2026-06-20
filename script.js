// 1. LISTA DE IMÁGENES
const imagesList = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpeg', '06.jpeg'];
const baseFolder = './img/carrusel/';

const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('dotsContainer');

// Empezamos en 1 porque el índice 0 será el CLON de la última foto
let currentIndex = 1; 
let autoPlayInterval;
let isTransitioning = false; 
let imagesElements = []; 

// --- 1. FUNCIÓN PARA CARGAR FOTOS Y CLONES (EFECTO INFINITO) ---
function createSlideElement(filename) {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    
    const bgImg = document.createElement('img');
    bgImg.src = baseFolder + filename;
    bgImg.classList.add('slide-bg');
    bgImg.draggable = false; 
    bgImg.oncontextmenu = () => false; 
    
    const fgImg = document.createElement('img');
    fgImg.src = baseFolder + filename;
    fgImg.alt = 'Trabajo de maquillaje';
    fgImg.classList.add('slide-fg');
    fgImg.draggable = false;
    fgImg.oncontextmenu = () => false;
    
    slide.appendChild(bgImg);
    slide.appendChild(fgImg);
    return slide;
}

function loadImages() {
    track.innerHTML = ''; 
    const slides = imagesList.map(filename => createSlideElement(filename));
    
    // Clonamos la primera y última foto para la ilusión óptica de infinito
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    
    // Agregamos al track: [Ultima Clon] -> [Reales] -> [Primera Clon]
    track.appendChild(lastClone);
    slides.forEach(slide => track.appendChild(slide));
    track.appendChild(firstClone);
    
    imagesElements = Array.from(track.children);
    
    // Posicionamos el track en la foto real #1 (escondiendo el clon) sin animación
    track.style.transition = 'none';
    track.style.transform = `translateX(-100%)`;
}

// --- 2. PAGINACIÓN (PUNTOS) ---
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
    
    // Ajustamos la matemática porque ahora el índice 1 es la foto 0 de los puntos
    let activeDotIndex = currentIndex - 1;
    if (currentIndex === 0) activeDotIndex = imagesList.length - 1;
    if (currentIndex === imagesElements.length - 1) activeDotIndex = 0;
    
    dots.forEach((dot, index) => {
        dot.className = 'dot'; 
        const distance = Math.abs(index - activeDotIndex);
        if (distance === 0) dot.classList.add('active');
        else if (distance === 1) dot.classList.add('adjacent');
        else if (distance === 2) dot.classList.add('outer');
        else dot.classList.add('hidden');
    });
}

// --- 3. MOVIMIENTO INFINITO ---
function moveToSlide(index) {
    if (isTransitioning) return; 
    isTransitioning = true;
    
    currentIndex = index;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    updatePagination();
}

// Magia negra del infinito: escucha cuándo termina la animación
track.addEventListener('transitionend', () => {
    isTransitioning = false;
    
    // Si llegó al clon del inicio, salta a la última foto real
    if (currentIndex === 0) {
        track.style.transition = 'none';
        currentIndex = imagesElements.length - 2;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Si llegó al clon del final, salta a la primera foto real
    if (currentIndex === imagesElements.length - 1) {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
});

// --- 4. TEMPORIZADOR INTELIGENTE (6.5s auto / 7s manual) ---
function startAutoPlay(duration = 6500) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
        // Si estaba en 7s por un toque previo, la siguiente vuelta se restaura a 6.5s
        if (duration !== 6500) startAutoPlay(6500);
    }, duration);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay(7000); 
}

// --- 5. EVENTOS: TOUCH (MÓVIL) Y BOTONES ---
let touchStartX = 0;
track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { 
        if (diff > 0) moveToSlide(currentIndex + 1); // Izquierda
        else moveToSlide(currentIndex - 1); // Derecha
        resetAutoPlay();
    }
});

prevBtn.addEventListener('click', () => { moveToSlide(currentIndex - 1); resetAutoPlay(); });
nextBtn.addEventListener('click', () => { moveToSlide(currentIndex + 1); resetAutoPlay(); });

// Inicializar el carrusel
loadImages();
setupPagination();
updatePagination();
startAutoPlay();