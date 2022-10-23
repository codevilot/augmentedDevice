const { ipcRenderer } = require("electron");
const store = require("electron-localstorage");
const { changeOpacity } = require("./utils/background.js");

const $webview = document.querySelector("webview");
const $address = document.getElementById("address");

window.addEventListener("DOMContentLoaded", () => {
  $webview.classList.toggle("dark", store.getItem("dark") === "dark");

  document.body.addEventListener("click", ({ target }) =>
    ipcRenderer.send(target.id)
  );

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
});
