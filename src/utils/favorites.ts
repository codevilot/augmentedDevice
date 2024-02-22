const writeFileSync = window.writeFileSync;
const readFileSync = window.readFileSync;
const existsSync = window.existsSync;

const toggleStar = {
  active($star: HTMLElement) {
    $star.classList.add("inactive");
    $star.textContent = "★";
  },
  inactive($star: HTMLElement) {
    $star.classList.add("active");
    $star.textContent = "☆";
  },
};

export const favorites = (() => {
  const getSrc = (src: string) => src.split("://")[1];
  const isBookmarkExist = existsSync();
  const getData = () =>
    isBookmarkExist
      ? JSON.parse(`${readFileSync()}`)
      : (() => {
          writeFileSync(JSON.stringify({}));
          return {};
        })();

  let data = getData();
  const $webview: Electron.WebviewTag = document.querySelector("webview");
  return {
    search() {
      return data[getSrc($webview.src)];
    },
    update(name: string) {
      data[getSrc($webview.src)] = { name: name };
      writeFileSync(JSON.stringify(data));
    },
    add(name: string) {
      if (this.search()) return;
      this.update(name);
    },
    remove() {
      delete data[getSrc($webview.src)];
      writeFileSync(JSON.stringify(data));
    },
    render() {
      const $star = document.getElementById("toggle-favorite");
      const favoritesList: Array<[string, { name: string }]> = Object.entries(
        getData()
      );
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
