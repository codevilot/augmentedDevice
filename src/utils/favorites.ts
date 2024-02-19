import { writeFileSync, readFileSync, existsSync } from "fs";

export const modal = {
  open(id: string) {
    document.getElementById(id).classList.add("open");
  },
  close(id: string) {
    document.getElementById(id).classList.remove("open");
  },
};
export const toggleStar = {
  active($star: HTMLElement) {
    $star.classList.add("inactive");
    $star.textContent = "★";
  },
  inactive($star: HTMLElement) {
    $star.classList.add("active");
    $star.textContent = "☆";
  },
};

export const favorites = () => {
  const getSrc = (src: string) => src.split("://")[1];
  const getData = () =>
    existsSync("./favorite.json")
      ? JSON.parse(`${readFileSync("./favorite.json")}`)
      : (() => {
          writeFileSync("favorite.json", JSON.stringify({}));
          return {};
        })();
  let data = getData();
  return {
    search() {
      const $webview: Electron.WebviewTag = document.querySelector("webview");
      return data[getSrc($webview.src)];
    },
    update(name: string) {
      const $webview: Electron.WebviewTag = document.querySelector("webview");
      data[getSrc($webview.src)] = { name: name };
      writeFileSync("favorite.json", JSON.stringify(data));
    },
    add(name: string) {
      if (this.search()) return;
      this.update(name);
    },
    remove() {
      const $webview: Electron.WebviewTag = document.querySelector("webview");
      delete data[getSrc($webview.src)];
      writeFileSync("favorite.json", JSON.stringify(data));
    },
    render($star) {
      const $webview: Electron.WebviewTag = document.querySelector("webview");
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
};
