const { writeFileSync, readFileSync, existsSync } = require("fs");

const modal = {
  open(id) {
    document.getElementById(id).classList.add("open");
  },
  close(id) {
    document.getElementById(id).classList.remove("open");
  },
};
const toggleStar = {
  active($star) {
    $star.classList.add("inactive");
    $star.textContent = "★";
  },
  inactive($star) {
    $star.classList.add("active");
    $star.textContent = "☆";
  },
};

const favorites = (() => {
  const getSrc = (src) => src.split("://")[1];
  const getData = () =>
    existsSync("./favorite.json")
      ? JSON.parse(readFileSync("./favorite.json"))
      : (() => {
          writeFileSync("favorite.json", JSON.stringify({}));
          return {};
        })();
  let data = getData();

  return {
    search() {
      return data[getSrc(document.querySelector("webview").src)];
    },
    update(name) {
      data[getSrc(document.querySelector("webview").src)] = { name: name };
      writeFileSync("favorite.json", JSON.stringify(data));
    },
    add(name) {
      if (this.search()) return;
      this.update(name);
    },
    remove() {
      delete data[getSrc(document.querySelector("webview").src)];
      writeFileSync("favorite.json", JSON.stringify(data));
    },
    render($star) {
      data = getData();
      const $webview = document.querySelector("webview");
      const favoritesList = Object.entries(data);
      console.log(favoritesList);
      if (this.search($webview.src)) toggleStar.active($star);
      else toggleStar.inactive($star);
      document.querySelector(".favorites").innerHTML = favoritesList
        .map(
          ([address, { name }]) =>
            `<button id="favorite" href="${address}">${name}</button>`
        )
        .join("");
    },
  };
})();

module.exports = {
  favorites,
  toggleStar,
  modal,
};
