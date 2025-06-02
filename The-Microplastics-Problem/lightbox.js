const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleria = document.querySelectorAll('#galleria img');
let currentIndex = 0;

galleria.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    openLightbox(img.src);
  });
});

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  lightbox.classList.add('hidden');
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleria.length;
  lightboxImg.src = galleria[currentIndex].src;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + galleria.length) % galleria.length;
  lightboxImg.src = galleria[currentIndex].src;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});
