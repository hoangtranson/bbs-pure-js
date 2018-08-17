const UTILS = (() => {
    const toArray = a => Array.apply(null, a);
    const attachFuncClick = () =>
      FP.curry((fn, el) => {
        el.addEventListener("click", fn);
        return el;
      });
    const attachFuncChange = () =>
      FP.curry((fn, el) => {
        el.addEventListener("change", fn);
        return el;
      });
    const removeFuncClick = () =>
      FP.curry((fn, el) => {
        el.removeEventListener("click", fn);
        return el;
      });
    const combineTdElement = item => {
      const dataRow = Object.keys(item).reduce((prev, current) => {
        if (current != "id" && current != "content") {
          return prev + tdElement(item[current]);
        }
        return prev + "";
      }, '');
      const action = `
        <td>
          <button class="view-article-action" data-action="showViewArticleModal" data-id=${item.id}>
            View
          </button>
          ||
          <button class="edit-article-action" data-action="showEditArticleModal" data-id=${item.id}>
            Edit
          </button>
          ||
          <button class="remove-article-action" data-action="showRemoveArticleModal" data-id=${item.id}>
            Delete
          </button>
        </td>`;
      return dataRow + action;
    };
    const trElement = trItem => `<tr>${trItem}</tr>`;
    const tdElement = tdItem => `<td>${tdItem}</td>`;
    const formatDate = d => {
      const date = new Date(d);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
    
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      return `${day} ${monthNames[monthIndex]} ${year}`;
    };
  
    const setValueOnForm = ({title = '', author = '', email = '', content = ''}) => {
        $title.value = title;
        $author.value = author;
        $email.value = email;
        $content.value = content;
    }
  
    const showModal = (isEdit = false) => {
      return FP.curry((el, event) => {
        DOM.removeClass(el, "hide");
        DOM.addClass(el, "show");
        DOM.addClass($err, "hide");
        DOM.removeClass($err, "show");
  
        if (isEdit) {
          const data = event.target.getAttribute("data-id");
          DATABASE.setItem("dataWorking", data);
  
          if(el === MODAL_ADD_EDIT_ARTICLE) {
            $modal_title.innerText = 'Update Article';
            const editID = DATABASE.getItem('dataWorking');
            const article = DATABASE.getArticle().filter( item => item.id == editID)[0];
            setValueOnForm(article);
          }
        } else {
            $modal_title.innerText = 'New Article';
            DATABASE.setItem('dataWorking', null);
            setValueOnForm({});
        }
      });
    }
    const closeModal = () =>
      FP.curry((el, event) => {
        DOM.removeClass(el, "show");
        DOM.addClass(el, "hide");
      });
    const showViewModal = (fn) => {
      return FP.curry((el, event) => {
        DOM.removeClass(el, "hide");
        DOM.addClass(el, "show");
  
        const localData = DATABASE.getArticle();
        const dataId = event.target.getAttribute("data-id");
        const article = localData.filter( item => item.id == dataId)[0];
        article.viewCount += 1 ;
  
        const index = localData.findIndex( item => item.id == article.id);
        localData[index] = article;
        fn(localData);
  
        DATABASE.saveArticle(localData);
        $modal_view_title.innerText = article.title;
        $title_view.innerText = article.title;
        $author_view.innerText = article.author;
        $email_view.innerText = article.email;
        $content_view.innerText = article.content;
      });
    }
    const chunk = (array, size) => {
      size = Math.max(size, 0)
      const length = array == null ? 0 : array.length
      if (!length || size < 1) {
        return []
      }
      let index = 0
      let resIndex = 0
      const result = new Array(Math.ceil(length / size))
    
      while (index < length) {
        result[resIndex++] = array.slice(index, (index += size))
      }
      return result;
    };
  
    return {
      toArray,
      onSubscribeClick: attachFuncClick(),
      onUnSubscribeClick: removeFuncClick(),
      onSubscribeChange : attachFuncChange(),
      trElement,
      combineTdElement,
      formatDate,
      showModal,
      showViewModal,
      closeModal,
      chunk
    };
  })();