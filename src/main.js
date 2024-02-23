import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import GalleryApiService from "./js/pixabay-api";
import  generateMarkupGallery  from "./js/render-functions";



const formElem = document.querySelector('.search-form');
const imagesContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');
const loader = document.querySelector('.loader')

const galerryApiService = new GalleryApiService();


formElem.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);


function onSearch(e) {
  loader.style.display = 'inline-block';
  imagesContainer.innerHTML = "";
  e.preventDefault();
  clearGallery();
  galerryApiService.userQuery = e.currentTarget.elements.
      searchQuery.value;
       

  if (galerryApiService.userQuery.trim() === '') {
    loader.style.display ='none';
    iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topLeft',
                transitionIn: "fadeInLeft",
            });

            
    return;
    
  };

  
  galerryApiService.resetPage();
  
  galerryApiService.fetchArticles().then(function (response) {
    loader.style.display = 'none';
    showLoadMoreBtn();
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

function appendGallery(response) {
  imagesContainer.insertAdjacentHTML('beforeend', generateMarkupGallery(response));

  const lightbox = new SimpleLightbox('.gallery a', options);
      lightbox.on('show.simplelightbox');
      lightbox.refresh();
  formElem.reset();
  
      
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