const DOM = (() => {
    const getElementById = id => document.getElementById(id);
    const getElementByClass = name => document.getElementsByClassName(name);
    const hasClass = (elem, className) =>
        elem.className.split(" ").indexOf(className) > -1;
    const addClass = (elem, className) => {
        if (!hasClass(elem, className)) {
            elem.className += " " + className;
        }
    };
    const removeClass = (elem, className) => {
        elem.className = elem.className
            .split(' ')
            .filter( c => c != className)
            .join(' ');
    };

    return {
        getElementById,
        getElementByClass,
        hasClass,
        addClass,
        removeClass
    };
})();