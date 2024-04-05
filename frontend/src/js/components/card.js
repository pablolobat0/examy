export default class Card {
  constructor(cardTitle) {
    this.element = document.createElement("div");
    this.element.classList.add("col-md-3", "mb-4");
    this.element.innerHTML = `<div class="card">
                                  <div class="card-body">
                                    <h5 class="card-title">${cardTitle}</h5>
                                  </div>
                                </div>`;
  }
}
