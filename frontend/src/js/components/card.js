export default class Card {
  constructor(cardId, cardTitle, linkPath = null) {
    this.element = document.createElement("div");
    this.element.classList.add("col-md-3", "mb-4");
    this.element.setAttribute("id", cardId);
    this.element.innerHTML = `<div class="card">
                                  <div class="card-body">
                                    <h5 class="card-title">${cardTitle}</h5>
                                  </div>
                                </div>`;
    if (linkPath) {
      this.element.querySelector(".card-body").addEventListener("click", () => {
        window.location.href = linkPath;
      });
    }
  }
}
