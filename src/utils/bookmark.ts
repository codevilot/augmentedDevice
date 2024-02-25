import { dom } from "./dom";

const { readFileSync, ipcRendererSend, writeFileSync } = window;

type bookmarkList = Array<[string, { name: string }]>;

class Bookmark {
  data: object;
  constructor() {
    this.data = readFileSync();
  }

  add() {
    const name = dom.bookmarkName.value;
    const updatedName = name.length > 0 ? name : dom.webview.getTitle();

    this.setName(updatedName);
    dom.bookmarkPopup.classList.remove("open");
    ipcRendererSend("rerender");
  }

  toggle() {
    const savedBookMark = this.data[this.getSrc()];
    if (savedBookMark) {
      //
    } else {
      this.add();
    }
    dom.bookmarkPopup.classList.toggle("open");
    dom.bookmarkName.value = this.data[this.getSrc()].name;
    dom.bookmarkIcon.focus();
    ipcRendererSend("rerender");
  }
  remove() {
    dom.bookmarkIcon.classList.add("inactive");
    dom.bookmarkPopup.classList.remove("open");

    delete this.data[this.getSrc()];
    writeFileSync(this.data);

    ipcRendererSend("rerender");
  }
  getSrc() {
    return dom.webview.src.split("://")[1];
  }
  setName(name: string) {
    this.data = { ...this.data, [this.getSrc()]: { name: name } };
    writeFileSync(this.data);
  }
  close() {
    dom.bookmarkIcon.classList.remove("inactive");
  }
  redirect(href: string) {
    dom.webview.loadURL("https://" + href);
  }
  private createBookmark([address, { name }]) {
    () => `<button id="favorite" href="${address}">${name}</button>`;
  }
  render() {
    const bookmarkList: bookmarkList = Object.entries(this.data);
    if (this.data[this.getSrc()]) dom.bookmarkIcon.classList.remove("inactive");
    else dom.bookmarkIcon.classList.add("inactive");

    dom.bookmarkBar.innerHTML =
      bookmarkList.length === 0
        ? `<div class="no-bookmark">------</div>`
        : bookmarkList.map(this.createBookmark).join("");
  }
}

export const bookmark = new Bookmark();
