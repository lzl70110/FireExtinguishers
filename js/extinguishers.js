
function fillExtinguisherSelects() {
    const selectedType = extinguisherType.value;
    const selectedRoom = extinguisherRoom.value;
    const selectedInspector = extinguisherInspector.value;

    // Зареждаме помещенията
    extinguisherRoom.innerHTML = `
        <option value="" disabled selected>-- избери помещение --</option>
        ${rooms
            .map(room => `<option value="${room.id}">${room.name}</option>`)
            .join("")}
    `;

    // Възстановяваме избраното помещение
    if (selectedRoom) {
        extinguisherRoom.value = selectedRoom;
    }

    const selectedRoomObject = rooms.find(room => room.id === selectedRoom);
    const selectedRoomName = selectedRoomObject ? selectedRoomObject.name : "";
    if (!selectedRoomName) {
        extinguisherTypeContainer.hidden = true;
    } else {
        extinguisherTypeContainer.hidden = false;
    }

    let availableTypes = [];

    if (selectedRoomName) {
        availableTypes = extinguisherTypes.filter(type => {
            // ПГИ / специално ограничен вид
            if (type.restrictedToRooms) {
                return type.restrictedToRooms.includes(selectedRoomName);
            }

            // Обикновен вид
            return true;
        });

        // Ако помещението е 06-113,
        // трябва да вижда САМО видовете, разрешени за него.
        if (selectedRoomName === "Диз. локомотив 06-113") {
            availableTypes = extinguisherTypes.filter(type =>
                type.restrictedToRooms &&
                type.restrictedToRooms.includes(selectedRoomName)
            );
        }
    }

    // Зареждаме видовете
    extinguisherType.innerHTML = `
        <option value="" disabled ${!selectedType ? "selected" : ""}>
            ${selectedRoomName ? "-- избери вид --" : "-- първо избери помещение --"}
        </option>
        ${availableTypes
            .map(type => {
                const index = extinguisherTypes.indexOf(type);
                return `<option value="${index}">${type.name}</option>`;
            })
            .join("")}
    `;

    // Възстановяваме вида само ако още е разрешен
    if (selectedType) {
        const typeStillAvailable = availableTypes.some(
            type => extinguisherTypes.indexOf(type).toString() === selectedType
        );

        if (typeStillAvailable) {
            extinguisherType.value = selectedType;
        }
    }

    // Зареждаме извършващите проверката
    extinguisherInspector.innerHTML = `
        <option value="" disabled selected>
            -- избери извършващ проверката --
        </option>
        ${inspectors
            .map(inspector =>
                `<option value="${inspector.id}">
                    ${inspector.code} - ${inspector.name}
                </option>`
            )
            .join("")}
    `;

    // Възстановяваме избрания проверяващ
    if (selectedInspector) {
        extinguisherInspector.value = selectedInspector;
    }
}
function updateValidUntilState() {
    const isValid = extinguisherStatus.value === "Годен";

    extinguisherValidUntil.disabled = !isValid;
    extinguisherValidUntil.required = isValid;

    if (!isValid) {
        extinguisherValidUntil.value = "";
    }

    updateExtinguisherSubmitState();
}

extinguisherStatus.addEventListener("change", updateValidUntilState);

function isValidUntilAfterCheckDate() {
    if (extinguisherStatus.value !== "Годен") return true;
    if (!extinguisherCheckDate.value || !extinguisherValidUntil.value) return false;

    const checkMonth = extinguisherCheckDate.value.slice(0, 7);
    return extinguisherValidUntil.value >= checkMonth;
}

function updateExtinguisherSubmitState() {
    const submitButton = extinguisherForm.querySelector("button[type='submit']");
    submitButton.disabled = !extinguisherForm.checkValidity() || !isValidUntilAfterCheckDate();
}

extinguisherForm.addEventListener("input", updateExtinguisherSubmitState);
extinguisherForm.addEventListener("change", updateExtinguisherSubmitState);
extinguisherRoom.addEventListener("change", () => {
    fillExtinguisherSelects();
    updateExtinguisherSubmitState();
});

// Ограничение за нова годност: текущият месец до +13 месеца.
// Засега е изкоментирано — активира се, когато решим.
// function setValidUntilLimits() {
//     const now = new Date();
//     const min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//     const maxDate = new Date(now.getFullYear(), now.getMonth() + 13, 1);
//     const max = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, "0")}`;
//     extinguisherValidUntil.min = min;
//     extinguisherValidUntil.max = max;
// }

function renderExtinguishers() {
    const list = document.getElementById("extinguishers-list");
    list.innerHTML = "";

    extinguishers.forEach((extinguisher, index) => {
        if (extinguisherId.value && extinguisher.id === extinguisherId.value) return;

        const room = findById(rooms, extinguisher.roomId);
        const inspector = findById(inspectors, extinguisher.inspectorId);
        const type = extinguisherTypes[extinguisher.typeIndex];

        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${type ? type.name : "—"}</td>
                    <td>${room ? room.name : "—"}</td>
                    <td>${extinguisher.status === "Годен" ? "✅ Годен" : "❌ Негоден"}</td>
                    <td>${formatDate(extinguisher.checkDate)}</td>
                    <td>${inspector ? inspector.code : "—"}</td>
                    <td>${formatMonth(extinguisher.validUntil)}</td>
                    <td>
                        <button type="button" onclick="editExtinguisher('${extinguisher.id}')">✏️ Редактирай</button>
                        <button type="button" onclick="deleteExtinguisher('${extinguisher.id}')">🗑️ Изтрий</button>
                    </td>
                `;

        list.appendChild(row);
    });
}

