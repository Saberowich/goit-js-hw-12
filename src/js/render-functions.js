export default function generateMarkupGallery(response) {
  console.log(response);
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

