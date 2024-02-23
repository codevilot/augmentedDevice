import { changeOpacity } from "./utils/background";
import { bookmark } from "./utils/bookmark";
import { setPageArrow } from "./utils/browser";
const { ipcRendererOn, ipcRendererSend, setStore, getStore } = window;

const $webview: Electron.WebviewTag = document.querySelector("webview");
const $address = document.getElementById("address") as HTMLInputElement;

ipcRendererOn("rerender", () => bookmark.render());
window.addEventListener("DOMContentLoaded", () => {
  $webview.classList.toggle("dark", getStore("dark") === "dark");
  document.body.addEventListener("click", ({ target }) => {
    switch (target["id"]) {
      case "favorite-background":
        bookmark.close();
        break;
      case "toggle-favorite":
        bookmark.toggle();
        break;
      case "add-favorite":
        bookmark.add();
        break;
      case "remove-favorite":
        bookmark.remove();
        break;
      case "favorite":
        bookmark.redirect(target["getAttribute"]("href"));
        break;
      default:
        ipcRendererSend(target["id"]);
    }
  });
  document
    .getElementById("favorite-detail")
    .addEventListener("keyup", ({ code }) => {
      if (code === "Enter") {
        bookmark.add();
        // actions["add-favorite"]();
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

  // favorites.render();
  bookmark.render();
  document.querySelector(".draggable").textContent = $webview.getTitle();
});
