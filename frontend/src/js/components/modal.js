import { logError } from "../utils/errorHandling.js";

export default class Modal {
  constructor(modalName) {
    this.saveButton = document.getElementById("saveModal");
    this.name = document.getElementById("nameInput");
    this.object = null;
    this.closeButton = document.getElementById("closeModal");
    this.modal = new bootstrap.Modal(document.getElementById(modalName));
    this.closeButton.onclick = () => {
      this.modal.hide();
    };
  }
  setValues(objectData) {
    this.object = objectData;
    this.name.value = this.object.name;
    this.modal.show();
  }

  onClick(callback) {
    this.saveButton.onclick = async () => {
      try {
        await callback(this.object.id, this.name.value);
        this.modal.hide();
      } catch (error) {
        logError(error, "alertModal");
      }
    };
  }
}
