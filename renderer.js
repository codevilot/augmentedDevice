const { ipcRenderer } = require("electron");
const { changeOpacity } = require("./utils/background.js");
const { setPageArrow } = require("./utils/browser.js");
const store = require("electron-localstorage");

const $webview = document.querySelector("webview");
const $address = document.getElementById("address");

window.addEventListener("DOMContentLoaded", () => {
  $webview.classList.toggle("dark", store.getItem("dark") === "dark");

  document.body.addEventListener("click", ({ target }) =>
    ipcRenderer.send(target.id)
  );
  document.getElementById("toggle-device").addEventListener("click", () => {
    if ($webview.getUserAgent() === "electron")
      $webview.setUserAgent(
        "Mozilla/5.0 (Linux; Android 4.2.1; en‑us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19"
      );
    else $webview.setUserAgent("electron");
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
  });
  document.getElementById("browser-color").addEventListener("click", () => {
    $webview.classList.toggle("dark");
    store.setItem("dark", $webview.matches(".dark") ? "dark" : "light");
  });
  $address.addEventListener("keyup", ({ code, target }) => {
    if (code === "Enter") {
      $webview.loadURL(
        !target.value.includes(".")
          ? "https://www.google.com/search?q=" + target.value
          : target.value.includes("http")
          ? target.value
          : "https://" + target.value
      );
    }
  });
  document.querySelector(".title-bar").addEventListener("mouseover", () => {
    document.querySelector(".title-bar").classList.add("active");
  });
  $webview.addEventListener("mouseover", () => {
    document.querySelector(".title-bar").classList.remove("active");
  });
});

window.addEventListener("load", () => {
  document.querySelector("webview").src = "https://google.com";
  /**
   location.hash.includes("http")
     ? location.hash.slice(1)
     : "https://" + location.hash.slice(1);
   
   */
});
$webview.addEventListener("did-stop-loading", ({ target }) => {
  $address.value = target.src;
  setPageArrow($webview);
});
