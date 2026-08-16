
function resetCrudForm(form, idField, cancelButton, submitText) {
    form.reset();
    idField.value = "";
    cancelButton.hidden = true;
    form.querySelector("button[type='submit']").textContent = submitText;
}

function cancelRoomEditAndRender() {
    resetRoomForm();
    renderRooms();
}

function cancelInspectorEditAndRender() {
    resetInspectorForm();
    renderInspectors();
}

function cancelExtinguisherEditAndRender() {
    resetExtinguisherForm();
    renderExtinguishers();
}


function setCrudEditState(form, idField, cancelButton, submitText) {
    cancelButton.hidden = false;
    form.querySelector("button[type='submit']").textContent = submitText;
}


function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function showConfirm(message, onConfirm) {
    const modal = document.getElementById("confirm-modal");
    const messageElement = document.getElementById("confirm-message");
    const confirmButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("confirm-cancel");

    messageElement.textContent = message;
    modal.classList.add("visible");

    const close = () => modal.classList.remove("visible");

    confirmButton.onclick = () => {
        close();
        onConfirm();
    };

    cancelButton.onclick = close;
}
