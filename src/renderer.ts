import { bookmark } from "./utils/bookmark";
import { browser } from "./utils/browser";
import { dom } from "./utils/dom";

const { ipcRendererOn, getStore } = window;

ipcRendererOn("rerender", () => bookmark.render());
ipcRendererOn("src", (_, url) => (dom.webview.src = url));

document.body.addEventListener("click", browser.setBookmarkEvent);
dom.webview.classList.toggle("dark", getStore("dark") === "dark");
dom.address.addEventListener("keyup", browser.redirect);
dom.webview.addEventListener("did-stop-loading", browser.renderBrowser);
dom.toggleDevice.addEventListener("click", browser.toggleDeviceAgent);
dom.prevPage.addEventListener("click", dom.webview.goBack);
dom.nextPage.addEventListener("click", dom.webview.goForward);
dom.browserOpacity.addEventListener("input", browser.changeOpacity);
dom.browserColor.addEventListener("click", browser.toggleDarkMode);
dom.bookmarkPopup.addEventListener("keyup", browser.keyupBookmark);
