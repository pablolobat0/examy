export default class Modal {
  constructor() {
    this.saveButton = document.getElementById("saveModal");
    this.name = document.getElementById("subjectNameInput");
    this.object = null;
    this.closeButton = document.getElementById("closeModal");
    this.modal = new bootstrap.Modal(document.getElementById("modal"));
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
    this.saveButton.onclick = () => {
      if (!this.name.value) {
        return;
      }
      callback(this.object.id, this.name.value);
      this.modal.hide();
    };
  }
}
