export const dom = {
  prevPage: document.getElementById("prev-page"),
  nextPage: document.getElementById("next-page"),
  webview: document.querySelector("webview") as Electron.WebviewTag,
  address: document.getElementById("address") as HTMLInputElement,
  bookmarkPopup: document.getElementById("bookmark-popup"),
  bookmarkIcon: document.getElementById("bookmark-icon") as HTMLInputElement,
  bookmarkBar: document.getElementById("bookmark-bar"),
  bookmarkName: document.getElementById("bookmark-name") as HTMLInputElement,
  toggleDevice: document.getElementById("toggle-device"),
  dragElement: document.querySelector(".draggable"),
  navigationButton: document.querySelector("#open-navigation"),
  browserColor: document.getElementById("browser-color"),
  browserOpacity: document.getElementById(
    "browser-opacity"
  ) as HTMLInputElement,
};
