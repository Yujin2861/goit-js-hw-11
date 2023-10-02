import { getImages } from "./js/getimages";
import { renderGalleryMarkup } from "./js/gallerymarkup";
import Notiflix from "notiflix";
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
import { selectors } from "./js/selectors";

  const lightbox = new SimpleLightbox('.gallery a');

  const hideBtnLoadMore = () => (selectors.loadMoreBtn.style.display = 'none');
  const showBtnLoadMore = () => (selectors.loadMoreBtn.style.display = 'block');
  hideBtnLoadMore();

let page = 1;
let perPage = 40;

selectors.form.addEventListener('submit', onFormSubmit);
async function onFormSubmit (event) {
    event.preventDefault();

  let result = selectors.form.elements.searchQuery.value.trim();
  page = 1;
  cleanGallery();

  if (result === '') {
    hideBtnLoadMore();
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const galleryItems = await getImages(result, page);
    let totalPages = galleryItems.data.totalHits;

    if (galleryItems.data.hits.length === 0) {
      cleanGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalPages >= 1 && totalPages < 40) {
      hideBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    } else if (totalPages > 40) {
      showBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    }
    renderGalleryMarkup(galleryItems.data.hits);

    lightbox.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  lightbox.refresh();
}


selectors.loadMoreBtn.addEventListener('click', onClickBtnLoadMore);
async function onClickBtnLoadMore() {
    page += 1;
    let result = selectors.form.elements.searchQuery.value.trim();
  
    try {
      const galleryItems = await getImages(result, page);
      let showPages = galleryItems.data.totalHits / perPage;
  
      if (showPages <= page) {
        hideBtnLoadMore();
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
  
      renderGalleryMarkup(galleryItems.data.hits);
    } catch (error) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    lightbox.refresh();
  }
  
  function cleanGallery() {
    selectors.gallery.innerHTML = '';
    page = 1;
    hideBtnLoadMore();
  }



 