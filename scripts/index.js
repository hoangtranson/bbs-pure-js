var current_page_index = 0;
var row_per_page = 5;

const MODAL_ADD_EDIT_ARTICLE = DOM.getElementById("modal-add-edit-article");
const MODAL_REMOVE_ARTICLE = DOM.getElementById("modal-remove-article");
const MODAL_VIEW_ARTICLE = DOM.getElementById("modal-view-article");

const $modal_title =  DOM.getElementById("modal-add-edit-article-title");
const $modal_view_title =  DOM.getElementById("modal-view-title");

const $title = DOM.getElementById("article-title");
const $author = DOM.getElementById("article-author");
const $email = DOM.getElementById("article-email");
const $content = DOM.getElementById("article-content");
const $err = DOM.getElementById('error-block');

const $title_view = DOM.getElementById("title-text");
const $author_view = DOM.getElementById("author-text");
const $email_view = DOM.getElementById("email-text");
const $content_view = DOM.getElementById("content-text");

const $article_table = DOM.getElementById('article-table');

(function() {
  DATABASE.init();
  const showAddNewArticleModal = UTILS.showModal()(MODAL_ADD_EDIT_ARTICLE);
  const hideAddNewArticleModal = UTILS.closeModal()(MODAL_ADD_EDIT_ARTICLE);
  const hideRemoveArticleModal = UTILS.closeModal()(MODAL_REMOVE_ARTICLE);
  const hideViewArticleModal = UTILS.closeModal()(MODAL_VIEW_ARTICLE);

  const TABLE_BODY = DOM.getElementById("bbs-table-body");

  const renderHtml = data => {
    const chunkData = UTILS.chunk(data, window.row_per_page);
    if(data.length == 0 ) {
      TABLE_BODY.innerHTML = 'No data';
      return [];
    }

    if(chunkData.length - 1 < window.current_page_index) {
      window.current_page_index --;
    }

    TABLE_BODY.innerHTML = FP.compose(
      FP.join(''),
      FP.map(el => UTILS.trElement(el)),
      FP.map(UTILS.combineTdElement)
    )(chunkData[window.current_page_index]);
    return data;
  };

  const addOneArticle = article => {
    const articleList = DATABASE.getArticle();
    const index = articleList.findIndex( item => item.id == article.id);
    if(index > -1) {
      articleList[index] = article;
    } else {
      articleList.push(article);
    }
    return articleList;
  };

  const bindOpenArticleModalEvent = () => {
    FP.compose(
      UTILS.onSubscribeClick(showAddNewArticleModal),
      DOM.getElementById
    )("bbs-add-new-btn");
  }

  const bindCloseArticleModalEvent = () => {
    FP.compose(
      FP.map(e => UTILS.onSubscribeClick(hideAddNewArticleModal, e)),
      UTILS.toArray,
      DOM.getElementByClass
    )("modal-close-btn");
  }

  const bindSaveArticleSubmit = () => {
    FP.compose(
      UTILS.onSubscribeClick(doAddNewArticleAction),
      DOM.getElementById
    )("confirm-add-article");
  }

  const bindCloseRemoveModalEvent = () => {
    FP.compose(
      FP.map(e => UTILS.onSubscribeClick(hideRemoveArticleModal, e)),
      UTILS.toArray,
      DOM.getElementByClass
    )("modal-close-btn");
  }

  const bindRemoveArticleSubmit = () => {
    FP.compose(
      UTILS.onSubscribeClick(doRemoveAction),
      DOM.getElementById
    )("confirm-remove-article");
  }

  const bindCloseViewArticleEvent = () => {
    FP.compose(
      FP.map(e => UTILS.onSubscribeClick(hideViewArticleModal, e)),
      UTILS.toArray,
      DOM.getElementByClass
    )("modal-view-close-btn");
  }
  const bindNextPageClickEvent = () => {
    FP.compose(
      UTILS.onSubscribeClick(nextPage),
      DOM.getElementById
    )("pagination_next");
  }

  const bindPrevPageClickEvent = () => {
    FP.compose(
      UTILS.onSubscribeClick(prevPage),
      DOM.getElementById
    )("pagination_prev");
  }

  const bindSelectListNumEvent = () => {
    FP.compose(
      UTILS.onSubscribeChange(changeDataPerPage),
      DOM.getElementById
    )("bbs-list-select");
  }

  const getValueArticleForm = () => {
    const title = $title.value;
    const author = $author.value;
    const email = $author.value;
    const content = $content.value;
    const viewCount = 0;
    const updatedDate = UTILS.formatDate(new Date());
    if(title == '' || author == '' || email == '' || content == '' ) {
      return null;
    }

    let id = 0;
    const editId = DATABASE.getItem('dataWorking');
    if (editId && editId != 'null') {
      id = editId;
    } else {
      const lastArticle = FP.last(DATABASE.getArticle());
      id = lastArticle.id + 1;
    }
    return { id, title, author, email, updatedDate, viewCount, content };
  };

  const doAddNewArticleAction = event => {
    const dataForm = getValueArticleForm();
    if (dataForm) {
      DOM.addClass($err, 'hide');
      FP.compose(
        hideAddNewArticleModal.bind(null),
        renderHtml,
        DATABASE.saveArticle,
        addOneArticle
      )(dataForm);
    } else {
      DOM.addClass($err, 'show');
    }
  };

  const doRemoveAction = event => {
    const deleteId = DATABASE.getItem("dataWorking");
    const newData = DATABASE.getArticle().filter(el => el.id != deleteId);
    FP.compose(
      hideRemoveArticleModal,
      renderHtml, 
      DATABASE.saveArticle
    )(newData);
    DATABASE.setItem("dataWorking", null);
  };

  const nextPage = e => {
    const localData = DATABASE.getArticle();
    const chunkData = UTILS.chunk(localData, window.row_per_page);

    if (window.current_page_index < chunkData.length - 1) {
      window.current_page_index ++;
    } else {
      window.current_page_index = 0;
    }
    renderHtml(localData);
  }

  const prevPage = e => {
    const localData = DATABASE.getArticle();
    const chunkData = UTILS.chunk(localData, window.row_per_page);

    if (window.current_page_index < 1) {
      window.current_page_index = chunkData.length - 1;
    } else {
      window.current_page_index --;
    }
    renderHtml(localData);
  }

  const changeDataPerPage = e => {
    window.row_per_page = e.target.value;
    renderHtml(DATABASE.getArticle());
  }

  renderHtml(DATABASE.getArticle());

  // add new article
  bindOpenArticleModalEvent();
  bindCloseArticleModalEvent();
  bindSaveArticleSubmit();

  // removed data event
  bindCloseRemoveModalEvent();
  bindRemoveArticleSubmit();

  // paging
  bindNextPageClickEvent();
  bindPrevPageClickEvent();

  bindSelectListNumEvent();
  bindCloseViewArticleEvent();

  // event delegation
  $article_table.addEventListener('click', (e) => {
    const ACTION = {
      showViewArticleModal: UTILS.showViewModal(renderHtml)(MODAL_VIEW_ARTICLE),
      showRemoveArticleModal: UTILS.showModal(true)(MODAL_REMOVE_ARTICLE),
      showEditArticleModal: UTILS.showModal(true)(MODAL_ADD_EDIT_ARTICLE),
    }
    const fn = event.target.getAttribute("data-action");
    if(!fn){
      return;
    } 
    ACTION[fn](event);
  });
})();
