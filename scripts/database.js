const DATABASE = (() => {
    const jsonToString = data => JSON.stringify(data);
    const stringToJson = data => JSON.parse(data);
    const getItem = name => localStorage.getItem(name);
    const setItem = (name, value) => localStorage.setItem(name, value);
    const removeItem = name => localStorage.removeItem(name);
  
    const articles = [
      {
        id: 1,
        title: "first day to the Sun",
        author: "Soobin",
        email: "soobin1@gmail.com",
        updatedDate: '11 August 2018',
        viewCount: 0,
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
      },
      {
        id: 2,
        title: "first day to the Moon",
        author: "Soobin",
        email: "soobin2@gmail.com",
        updatedDate: '15 August 2018',
        viewCount: 0,
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
      }
    ];
    const init = () => {
        const isExist = getArticle(articles);
        if(!isExist) {
            setItem("articles", jsonToString(articles));
        }
    };
    const getArticle = () => stringToJson(getItem("articles"));
    const saveArticle = data => {
      setItem("articles", jsonToString(data));
      return data;
    };
    return {
      init,
      setItem,
      getItem,
      removeItem,
      getArticle,
      saveArticle
    };
  })();