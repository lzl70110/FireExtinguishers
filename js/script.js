

const roomForm = document.getElementById("room-form");
const roomId = document.getElementById("room-id");
const roomName = document.getElementById("room-name");
const roomsList = document.getElementById("rooms-list");
const cancelRoomEdit = document.getElementById("cancel-room-edit");

const inspectorForm = document.getElementById("inspector-form");
const inspectorId = document.getElementById("inspector-id");
const inspectorCode = document.getElementById("inspector-code");
const inspectorName = document.getElementById("inspector-name");
const inspectorsList = document.getElementById("inspectors-list");
const cancelInspectorEdit = document.getElementById("cancel-inspector-edit");

const extinguisherForm = document.getElementById("extinguisher-form");
const extinguisherId = document.getElementById("extinguisher-id");
const extinguisherType = document.getElementById("extinguisher-type");
const extinguisherTypeContainer = document.getElementById("extinguisher-type-container");

const extinguisherRoom = document.getElementById("extinguisher-room");
const extinguisherStatus = document.getElementById("extinguisher-status");
const extinguisherCheckDate = document.getElementById("extinguisher-check-date");
const extinguisherInspector = document.getElementById("extinguisher-inspector");
const extinguisherValidUntil = document.getElementById("extinguisher-valid-until");
const cancelExtinguisherEdit = document.getElementById("cancel-extinguisher-edit");

const extinguishers = [];


extinguisherForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isEditing = Boolean(extinguisherId.value);

    const data = {
        typeIndex: Number(extinguisherType.value),
        roomId: extinguisherRoom.value,
        status: extinguisherStatus.value,
        checkDate: extinguisherCheckDate.value,
        inspectorId: extinguisherInspector.value,
        validUntil: extinguisherValidUntil.value
    };

    let message;

    if (isEditing) {
        const extinguisher = findById(extinguishers, extinguisherId.value);

        if (hasChanges(extinguisher, data, ["typeIndex", "roomId", "status", "checkDate", "inspectorId", "validUntil"])) {
            Object.assign(extinguisher, data);
            message = "✅ Пожарогасителят е редактиран.";
        } else {
            message = "ℹ️ Няма направени промени.";
        }
    } else {
        extinguishers.push({
            id: crypto.randomUUID(),
            ...data
        });
        message = "✅ Пожарогасителят е добавен.";
    }

    resetExtinguisherForm();
    renderExtinguishers();
    showToast(message);
});

function editExtinguisher(id) {
    const extinguisher = findById(extinguishers, id);

    fillExtinguisherSelects();
    extinguisherId.value = extinguisher.id;
    extinguisherType.value = extinguisher.typeIndex;
    extinguisherRoom.value = extinguisher.roomId;
    extinguisherStatus.value = extinguisher.status;
    extinguisherCheckDate.value = extinguisher.checkDate;
    extinguisherInspector.value = extinguisher.inspectorId;
    extinguisherValidUntil.value = extinguisher.validUntil;
    setCrudEditState(extinguisherForm, extinguisherId, cancelExtinguisherEdit, "💾 Запази");
    updateValidUntilState();
    updateExtinguisherSubmitState();
    renderExtinguishers();
}

function deleteExtinguisher(id) {
    showConfirm("🗑️ Да се изтрие ли пожарогасителят?", () => {
        removeById(extinguishers, id);
        renderExtinguishers();
        showToast("🗑️ Пожарогасителят е изтрит.");
    });
}

function resetExtinguisherForm() {
    resetCrudForm(extinguisherForm, extinguisherId, cancelExtinguisherEdit, "➕ Добави");
    updateValidUntilState();
    updateExtinguisherSubmitState();
}

cancelExtinguisherEdit.addEventListener("click", cancelExtinguisherEditAndRender);

function renderRooms() {
    roomsList.innerHTML = "";

    rooms.forEach((room, index) => {
        if (roomId.value && room.id === roomId.value) return;

        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${room.name}</td>
                    <td>
                        <button type="button" onclick="editRoom('${room.id}')">✏️ Редактирай</button>
                        <button type="button" onclick="deleteRoom('${room.id}')">🗑️ Изтрий</button>
                    </td>
                `;

        roomsList.appendChild(row);
    });
}

roomForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isEditing = Boolean(roomId.value);

    const name = roomName.value.trim();

    if (!name) return;

    let message;

    if (isEditing) {
        const room = rooms.find(room => room.id === roomId.value);

        if (room.name !== name) {
            room.name = name;
            message = "✅ Помещението е редактирано.";
        } else {
            message = "ℹ️ Няма направени промени.";
        }
    } else {
        rooms.push({
            id: crypto.randomUUID(),
            name: name
        });
        message = "✅ Помещението е добавено.";
    }

    resetRoomForm();
    renderRooms();
    fillExtinguisherSelects();
    showToast(message);
});

function editRoom(id) {
    const room = findById(rooms, id);

    roomId.value = room.id;
    roomName.value = room.name;
    setCrudEditState(roomForm, roomId, cancelRoomEdit, "💾 Запази");
    roomName.focus();
    renderRooms();
}

function deleteRoom(id) {
    const room = rooms.find(room => room.id === id);

    showConfirm(`🗑️ Да се изтрие ли помещение „${room.name}“?`, () => {
        removeById(rooms, id);
        renderRooms();
        fillExtinguisherSelects();
        showToast("🗑️ Помещението е изтрито.");
    });
}

function resetRoomForm() {
    resetCrudForm(roomForm, roomId, cancelRoomEdit, "➕ Добави");
}

cancelRoomEdit.addEventListener("click", cancelRoomEditAndRender);

function renderInspectors() {
    inspectorsList.innerHTML = "";

    inspectors.forEach((inspector, index) => {
        if (inspectorId.value && inspector.id === inspectorId.value) return;

        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${inspector.code}</td>
                    <td>${inspector.name}</td>
                    <td>
                        <button type="button" onclick="editInspector('${inspector.id}')">✏️ Редактирай</button>
                        <button type="button" onclick="deleteInspector('${inspector.id}')">🗑️ Изтрий</button>
                    </td>
                `;

        inspectorsList.appendChild(row);
    });
}

inspectorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // const isEditing = Boolean(inspectorId.value);

    const code = inspectorCode.value.trim();
    const name = inspectorName.value.trim();

    if (!code || !name) return;

    let message;

    if (inspectorId.value) {
        const inspector = inspectors.find(inspector => inspector.id === inspectorId.value);

        if (inspector.code !== code || inspector.name !== name) {
            inspector.code = code;
            inspector.name = name;
            message = "✅ Проверяващият е редактиран.";
        } else {
            message = "ℹ️ Няма направени промени.";
        }
    } else {
        inspectors.push({
            id: crypto.randomUUID(),
            code: code,
            name: name
        });
        message = "✅ Проверяващият е добавен.";
    }

    resetInspectorForm();
    renderInspectors();
    fillExtinguisherSelects();
    showToast(message);
});

function editInspector(id) {
    const inspector = findById(inspectors, id);

    inspectorId.value = inspector.id;
    inspectorCode.value = inspector.code;
    inspectorName.value = inspector.name;
    setCrudEditState(inspectorForm, inspectorId, cancelInspectorEdit, "💾 Запази");
    inspectorCode.focus();
    renderInspectors();
}

function deleteInspector(id) {
    const inspector = inspectors.find(inspector => inspector.id === id);

    showConfirm(`🗑️ Да се изтрие ли проверяващият „${inspector.code} - ${inspector.name}“?`, () => {
        removeById(inspectors, id);
        renderInspectors();
        fillExtinguisherSelects();
        showToast("🗑️ Проверяващият е изтрит.");
    });
}

function resetInspectorForm() {
    resetCrudForm(inspectorForm, inspectorId, cancelInspectorEdit, "➕ Добави");
}

cancelInspectorEdit.addEventListener("click", cancelInspectorEditAndRender);

async function init() {
    await loadData();

    renderRooms();
    renderInspectors();
    fillExtinguisherSelects();
    updateValidUntilState();
    updateExtinguisherSubmitState();
    renderExtinguishers();
}

init();