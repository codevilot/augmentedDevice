const changeOpacity = (selector, opacity) => {
  document.querySelector(selector).style.opacity =
    document.querySelector(opacity).value;
};
module.exports = {
  changeOpacity,
};
