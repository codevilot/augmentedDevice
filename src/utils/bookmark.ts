import { dom } from "./dom";

const { readFileSync, ipcRendererSend, writeFileSync, existsSync } = window;

type bookmarkList = Array<[string, { name: string }]>;

class Bookmark {
  data: object;
  constructor() {
    this.data = this.init();
  }

  init() {
    if (existsSync()) return readFileSync();
    writeFileSync({});
    return {};
  }

  add() {
    const name = dom.bookmarkName.value;
    const updatedName = name.length > 0 ? name : dom.webview.getTitle();

    this.setName(updatedName);

    dom.bookmarkIcon.classList.remove("inactive");
    dom.bookmarkIcon.textContent = "★";
    dom.bookmarkPopup.classList.add("open");
    ipcRendererSend("rerender");
  }

  toggle() {
    dom.bookmarkPopup.classList.remove("open");
    dom.bookmarkIcon.classList.remove("active");
    dom.bookmarkIcon.textContent = "☆";
    dom.bookmarkName.value = this.data[this.getSrc()].name;
    dom.bookmarkIcon.focus();
    ipcRendererSend("rerender");
  }
  remove() {
    dom.bookmarkIcon.classList.remove("inactive");
    dom.bookmarkIcon.textContent = "★";
    dom.bookmarkPopup.classList.add("open");

    delete this.data[this.getSrc()];
    writeFileSync(this.data);

    ipcRendererSend("rerender");
  }
  getSrc() {
    return dom.webview.src.split("://")[1];
  }
  setName(name: string) {
    this.data = { [this.getSrc()]: { name: name } };
    writeFileSync(this.data);
  }
  close() {
    dom.bookmarkIcon.classList.remove("inactive");
  }
  redirect(href: string) {
    dom.webview.loadURL("https://" + href);
  }
  render() {
    const bookmarkList: bookmarkList = Object.entries(this.data);
    if (this.data[this.getSrc()]) {
      dom.bookmarkIcon.classList.remove("inactive");
      dom.bookmarkIcon.textContent = "★";
    } else {
      dom.bookmarkIcon.classList.remove("active");
      dom.bookmarkIcon.textContent = "☆";
    }
    dom.bookmarkBar.innerHTML = bookmarkList
      .map(
        ([address, { name }]) =>
          `<button id="favorite" href="${address}">${name}</button>`
      )
      .join("");
  }
}

export const bookmark = new Bookmark();
