export default class Modal {
  constructor() {
    this.saveButton = document.getElementById("saveModal");
    this.name = document.getElementById("subjectNameInput");
    this.originalName = null;
    this.object = null;
    this.closeButton = document.getElementById("closeModal");
    this.modal = new bootstrap.Modal(document.getElementById("modal"));
    this.closeButton.onclick = () => {
      this.modal.hide();
    };
  }

  setValues(object) {
    this.name.value = object.name;
    this.originalName = object.name;
    this.object = object;
    this.modal.show();
  }

  onClick(callback) {
    this.saveButton.onclick = () => {
      if (!this.name.value) {
        return;
      }
      callback(this.object.id, {
        name: this.name.value,
        originalName: this.originalName,
      });
      console.log(this.object, this.name.value);
      this.object.name = this.name.value;
      this.modal.hide();
    };
  }
}
