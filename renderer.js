const { ipcRenderer } = require("electron");
const storage = require("electron-localStorage");
window.addEventListener("DOMContentLoaded", () => {
  const newBrowser = () => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const button = document.createElement("button");
    li.append(input);
    li.append(button);
    button.textContent = "X";
    input.classList.add("url");
    return li;
  };

  const createLi = () => {
    const li = newBrowser();
    document.querySelector(".opend-list").append(li);
    return li;
  };

  const setUrl = () => {
    storage.setItem(
      "list",
      [...document.querySelectorAll(".url")].map((element) => element.value)
    );
  };
  document.getElementById("close-main").addEventListener("click", () => {
    ipcRenderer.send("close-main");
  });

  document
    .getElementById("add-browser")
    .addEventListener("click", () => createLi());
  document.getElementById("open-browser").addEventListener("click", () => {
    ipcRenderer.send("open-browser");
  });
  document
    .querySelector(".opend-list")
    .addEventListener("click", ({ target }) => {
      if (target.matches("button")) {
        target.closest("li").remove();
        setUrl();
      }
    });
  document
    .querySelector(".opend-list")
    .addEventListener("keyup", ({ code, target }) => {
      if (code === "Enter") {
        setUrl();
        ipcRenderer.send("open-add-browser", target.value);
      }
    });
  if (storage.getItem("list").length > 0) {
    storage.getItem("list").map((item) => {
      const value = createLi();
      value.querySelector("input").value = item;
      ipcRenderer.send("open-add-browser", item);
    });
  }
});
