import { changeOpacity } from "./utils/background";
import { setPageArrow } from "./utils/browser";
import { favorites } from "./utils/favorites";
const ipcRendererOn = window.ipcRendererOn;
const ipcRendererSend = window.ipcRendererSend;
const setStore = window.setStore;
const getStore = window.getStore;

const $webview: Electron.WebviewTag = document.querySelector("webview");
const $address = document.getElementById("address") as HTMLInputElement;
const $star = document.getElementById("toggle-favorite");
const $favoriteName = document.getElementById(
  "favorite-name"
) as HTMLInputElement;

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
const sendRerender = () => ipcRendererSend("rerender");
const actions = {
  modalElement: "favorite-detail",
  "favorite-background"() {
    modal.close(this.modalElement);
  },
  "toggle-favorite"() {
    modal.open(this.modalElement);
    toggleStar.active($star);
    favorites.add($webview.getTitle());
    $favoriteName.value = favorites.search().name;
    $favoriteName.focus();
    sendRerender();
  },
  "add-favorite"() {
    const name = $favoriteName.value;
    favorites.update(name.length > 0 ? name : $webview.getTitle());
    modal.close(this.modalElement);
    toggleStar.inactive($star);
    sendRerender();
  },
  "remove-favorite"() {
    favorites.remove();
    toggleStar.inactive($star);
    modal.close(this.modalElement);
    sendRerender();
  },
  favorite(target) {
    $webview.loadURL("https://" + target.getAttribute("href"));
  },
};

ipcRendererOn("rerender", () => favorites.render());
window.addEventListener("DOMContentLoaded", () => {
  $webview.classList.toggle("dark", getStore("dark") === "dark");
  document.body.addEventListener("click", ({ target }) => {
    if (actions[target["id"]]) actions[target["id"]](target);
    else ipcRendererSend(target["id"]);
  });
  document
    .getElementById("favorite-detail")
    .addEventListener("keyup", ({ code }) => {
      if (code === "Enter") {
        actions["add-favorite"]();
      }
    });
  document.getElementById("toggle-device").addEventListener("click", () => {
    const isElectronAgent = $webview.getUserAgent() === "electron";
    $webview.setUserAgent(
      isElectronAgent
        ? "Mozilla/5.0 (Linux; Android 4.2.1; en‑us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19"
        : "electron"
    );

    $webview.reload();
  });
  document.getElementById("prev-page").addEventListener("click", () => {
    $webview.goBack();
  });
  document.getElementById("next-page").addEventListener("click", () => {
    $webview.goForward();
  });
  document.getElementById("browser-opacity").addEventListener("input", () => {
    changeOpacity("webview", "#browser-opacity");
    // changeOpacity(".title-bar", "#browser-opacity");
  });
  document.getElementById("browser-color").addEventListener("click", () => {
    $webview.classList.toggle("dark");
    setStore("dark", $webview.matches(".dark") ? "dark" : "light");
  });
});
$address.addEventListener("keyup", ({ code, target }) => {
  const $webview: Electron.WebviewTag = document.querySelector("webview");
  if (code === "Enter") {
    $webview.loadURL(
      !target["value"].includes(".")
        ? "https://www.google.com/search?q=" + target["value"]
        : target["value"].includes("http")
        ? target["value"]
        : "https://" + target["value"]
    );
  }
});

ipcRendererOn("src", (_, url) => ($webview.src = url));

$webview.addEventListener("did-stop-loading", ({ target }) => {
  $address.value = target["src"];
  setPageArrow($webview);

  favorites.render();
  document.querySelector(".draggable").textContent = $webview.getTitle();
});
