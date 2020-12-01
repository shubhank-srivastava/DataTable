import "./modal.css";

class Modal {
  constructor(node, config) {
    this.title = config.title;
    this.body = config.body;
    this.onOk = config.onOk;
    this.onCancel = config.onCancel;
    this.modal = node;
  }

  show() {
    let modal = this.render();
    if (!this.modal.firstChild) this.modal.appendChild(modal);
    else this.modal.replaceChild(modal, this.modal.firstChild);
  }

  hide() {
    this.modal.firstChild.remove();
  }

  render() {
    let modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
    let modal = document.createElement("div");
    modal.className = "modal";
    let modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = this.title;
    let modalBody = document.createElement("div");
    if (typeof this.body === "string") modalBody.innerHTML = this.body;
    else modalBody.appendChild(this.body);
    modalBody.className = "modal-body";
    let modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    if (this.onCancel) {
      let cancelBtn = document.createElement("button");
      cancelBtn.appendChild(document.createTextNode("Cancel"));
      cancelBtn.addEventListener("click", this.onCancel);
      modalFooter.appendChild(cancelBtn);
    }
    if (this.onOk) {
      let okBtn = document.createElement("button");
      okBtn.appendChild(document.createTextNode("Okay"));
      okBtn.addEventListener("click", this.onOk);
      modalFooter.appendChild(okBtn);
    }
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modal.appendChild(modalFooter);
    modalContainer.appendChild(modal);
    return modalContainer;
  }
}

export default Modal;
