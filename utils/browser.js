const setPageArrow = ($webview) => {
  document
    .getElementById("prev-page")
    .classList.toggle("inactive", !$webview.canGoBack());
  document
    .getElementById("next-page")
    .classList.toggle("inactive", !$webview.canGoForward());
};

module.exports = {
  setPageArrow,
};
