export const changeOpacity = (selector: string, opacity: string) => {
  const $selector: HTMLElement = document.querySelector(selector);
  const $opacity: HTMLInputElement = document.querySelector(opacity);
  $selector.style.opacity = $opacity.value;
  // document.documentElement.style.setProperty("--opacity", $opacity.value);
};
