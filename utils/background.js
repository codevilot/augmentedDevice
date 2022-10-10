const changeBackground = (opacityId, rgbId) => {
  const hexToRGB = (hex) => {
    let RGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return RGB
      ? {
          r: parseInt(RGB[1], 16),
          g: parseInt(RGB[2], 16),
          b: parseInt(RGB[3], 16),
        }
      : null;
  };
  const opacity = document.querySelector(opacityId).value;
  const RGB = hexToRGB(document.querySelector(rgbId).value);

  document.body.style.backgroundColor = `rgba(${RGB.r}, ${RGB.g}, ${RGB.b}, ${opacity})`;
};
const changeOpacity = (selector, opacity) => {
  document.querySelector(selector).style.opacity =
    document.querySelector(opacity).value;
};
module.exports = {
  changeBackground,
  changeOpacity,
};
