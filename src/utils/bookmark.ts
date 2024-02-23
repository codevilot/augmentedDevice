const { readFileSync, ipcRendererSend, writeFileSync, existsSync } = window;
const BOOKMARK_ELEMENT_ID = "favorite-detail";
const STAR_ELEMENT_ID = "toggle-favorite";
const BOOKMARK_NAME_ELEMENT_ID = "favorite-name";
const BOOKMARK_LIST_SELECTOR = ".favorites";

type bookmarkList = Array<[string, { name: string }]>;

class Bookmark {
  element: HTMLElement;
  $star: HTMLElement;
  $bookmarkName: HTMLInputElement;
  data: object;
  $bookmarkList: HTMLElement;
  webview: Electron.WebviewTag;
  constructor() {
    this.element = document.getElementById(BOOKMARK_ELEMENT_ID);
    this.$star = document.getElementById(STAR_ELEMENT_ID);
    this.$bookmarkName = document.getElementById(
      BOOKMARK_NAME_ELEMENT_ID
    ) as HTMLInputElement;
    this.$bookmarkList = document.querySelector(BOOKMARK_LIST_SELECTOR);
    this.data = this.init();
    this.webview = document.querySelector("webview");
  }

  init() {
    if (existsSync()) return readFileSync();
    writeFileSync({});
    return {};
  }

  add() {
    const name = this.$bookmarkName.value;
    const updatedName = name.length > 0 ? name : this.webview.getTitle();

    this.setName(updatedName);

    this.$star.classList.remove("inactive");
    this.$star.textContent = "★";
    this.element.classList.add("open");
    ipcRendererSend("rerender");
  }

  toggle() {
    this.element.classList.remove("open");
    this.$star.classList.remove("active");
    this.$star.textContent = "☆";
    this.$bookmarkName.value = this.data[this.getSrc()].name;
    this.$star.focus();
    ipcRendererSend("rerender");
  }
  remove() {
    this.$star.classList.remove("inactive");
    this.$star.textContent = "★";
    this.element.classList.add("open");

    delete this.data[this.getSrc()];
    writeFileSync(this.data);

    ipcRendererSend("rerender");
  }
  getSrc() {
    return this.webview.src.split("://")[1];
  }
  setName(name: string) {
    this.data = { [this.getSrc()]: { name: name } };
    writeFileSync(this.data);
  }
  close() {
    this.$star.classList.remove("inactive");
  }
  redirect(href: string) {
    this.webview.loadURL("https://" + href);
  }
  render() {
    const favoritesList: bookmarkList = Object.entries(this.data);
    if (this.data[this.getSrc()]) {
      this.$star.classList.remove("inactive");
      this.$star.textContent = "★";
    } else {
      this.$star.classList.remove("active");
      this.$star.textContent = "☆";
    }
    this.$bookmarkList.innerHTML = favoritesList
      .map(
        ([address, { name }]) =>
          `<button id="favorite" href="${address}">${name}</button>`
      )
      .join("");
  }
}

export const bookmark = new Bookmark();
