import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import GalerryApiService from "./gallery-service";

const inputElem = document.querySelector('.search-input');
const formElem = document.querySelector('.search-form');
const imagesContainer = document.querySelector('.gallery');
const divElem = document.querySelector('div');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');


const galerryApiService = new GalerryApiService();


const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  loadMoreBtn.append(loader);
}

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

formElem.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);


function onSearch(e) {
  showLoader();
  imagesContainer.innerHTML = "";
  e.preventDefault();
  clearGallery();
  galerryApiService.userQuery = e.currentTarget.elements.
      searchQuery.value;
  if (galerryApiService.userQuery.trim() === '') {
    iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topLeft',
                transitionIn: "fadeInLeft",
            });
            hideLoader()
  };
  showLoadMoreBtn();
  galerryApiService.resetPage();
  
  galerryApiService.fetchArticles().then(function (response) {
    appendGallery(response);
    
    if (response.hits.length === 0) {
      iziToast.error({
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topLeft',
          transitionIn: "fadeInLeft",
      });
      loadMoreBtn.classList.add('is-hidden');
    }
  })
    .catch(function (error) {
      console.log(error);
    });
    
}

function onLoadMore() {
galerryApiService.fetchArticles().then(function (response) {
  appendGallery(response);
  boundingClientRect();
  if (imagesContainer.children.length >= response.totalHits) {
    iziToast.error({
                message: 'We are sorry, but you have reached the end of search results.',
                position: 'topCenter',
                transitionIn: "fadeInLeft",
    });
    loadMoreBtn.classList.add('is-hidden');
    
  }
  });
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}

function boundingClientRect() {
    const { height: cardHeight } = document.querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
}

function generateMarkupGalerry(response) {
  return response.hits.map((response) => {
  return `
            <li class="gallery-item"><a href="${response.largeImageURL}">
          <img class="gallery-image" src="${response.webformatURL}" alt="${response.tags}"></a>
          <p>Likes: ${response.likes}</p>
          <p>Views: ${response.views}</p>
          <p>Comments: ${response.comments}</p>
          <p>Downloads: ${response.downloads}</p>
          </li>`;
  }).join('');
 
}

function appendGallery(response) {
  imagesContainer.insertAdjacentHTML('beforeend', generateMarkupGalerry(response));

  const lightbox = new SimpleLightbox('.gallery a', options);
      lightbox.on('show.simplelightbox');
      lightbox.refresh();
  formElem.reset();
  hideLoader();
      
}

function clearGallery() {
  imagesContainer.innerHTML = '';
}
 

const options = {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionSelector: "img",
  captionDelay: 250,
};