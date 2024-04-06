export default class Button {
  constructor({ buttonClass, buttonText, onclick }) {
    this.button = document.createElement("button");
    this.button.classList.add("btn", buttonClass);
    this.button.innerHTML = buttonText;
    this.button.onclick = onclick;
  }
}
