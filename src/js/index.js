import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const API_KEY = '38935709-b029574ae436a7c060eaadb25';
const ITEMS_PER_PAGE = 40;
let currentPage = 1;
let currentSearchQuery = '';

const lightbox = new SimpleLightbox('.photo-card a');

async function searchImages(query) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
      },
    });

    const { hits, totalHits } = response.data;

    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.style.display = 'none';
      return;
    }

    hits.forEach(hit => {
      const card = document.createElement('div');
      card.classList.add('photo-card');
      card.innerHTML = `
        <a href="${hit.largeImageURL}">
          <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${hit.likes}</p>
          <p class="info-item"><b>Views:</b> ${hit.views}</p>
          <p class="info-item"><b>Comments:</b> ${hit.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${hit.downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });

    lightbox.refresh();
    currentPage++;
    loadMoreButton.style.display = 'block';
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  currentPage = 1;
  gallery.innerHTML = '';
  const searchQuery = e.target.searchQuery.value.trim();
  currentSearchQuery = searchQuery;
  searchImages(searchQuery);
});

loadMoreButton.addEventListener('click', () => {
  searchImages(currentSearchQuery);
  window.scrollBy({
    top: gallery.firstElementChild.getBoundingClientRect().height * 2,
    behavior: 'smooth',
  });
});
loadMoreButton.style.display = 'none';
