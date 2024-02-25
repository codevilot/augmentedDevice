import { bookmark } from "./bookmark";
import { dom } from "./dom";
const { setStore, ipcRendererSend } = window;
const MOBILE_AGENT =
  "Mozilla/5.0 (Linux; Android 4.2.1; en‑us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19";
const PC_AGENT = "electron";

class Browser {
  public changeOpacity() {
    dom.webview.style.opacity = dom.browserOpacity.value;
  }
  public toggleDarkMode() {
    dom.webview.classList.toggle("dark");
    setStore("dark", dom.webview.matches(".dark") ? "dark" : "light");
  }
  public toggleDeviceAgent() {
    const isElectronAgent = dom.webview.getUserAgent() === PC_AGENT;
    dom.webview.setUserAgent(isElectronAgent ? MOBILE_AGENT : PC_AGENT);
    dom.webview.reload();
  }
  public renderBrowser({ target }: Event) {
    dom.address.value = target["src"];
    dom.prevPage.classList.toggle("inactive", !dom.webview.canGoBack());
    dom.nextPage.classList.toggle("inactive", !dom.webview.canGoForward());
    bookmark.render();
    dom.dragElement.textContent = dom.webview.getTitle();
  }
  public redirect({ code, target }: KeyboardEvent) {
    if (code !== "Enter") return;
    dom.webview.loadURL(
      !target["value"].includes(".")
        ? "https://www.google.com/search?q=" + target["value"]
        : target["value"].includes("http")
        ? target["value"]
        : "https://" + target["value"]
    );
  }
  public keyupBookmark({ code }: KeyboardEvent) {
    if (code === "Enter") bookmark.add();
  }
  public bookmarkEvent({ target }: Event) {
    switch (target["id"]) {
      case "navigation-background":
        //TODO: split event
        dom.navigationButton.classList.remove("open");
        break;
      case "favorite-background":
        bookmark.close();
        break;
      case "bookmark-icon":
        bookmark.toggle();
        break;
      case "add-favorite":
        bookmark.add();
        break;
      case "remove-favorite":
        bookmark.remove();
        break;
      case "favorite":
        dom.navigationButton.classList.remove("open");
        bookmark.redirect(target["getAttribute"]("href"));
        break;
      default:
        ipcRendererSend(target["id"]);
    }
  }
  public openNavigation() {
    dom.navigationButton.classList.add("open");
  }
  public openDevtools({ code }: KeyboardEvent) {
    if (code !== "F12") return;
    dom.webview.openDevTools();
  }
}

export const browser = new Browser();
