

let extinguisherTypes = [];
let inspectors = [];
let rooms = [];

async function loadData() {
    try {
        const [typesResponse, inspectorsResponse, roomsResponse] = await Promise.all([
            fetch("./data/extinguisher-types.json"),
            fetch("./data/inspectors.json"),
            fetch("./data/rooms.json")
        ]);

        if (!typesResponse.ok) {
            throw new Error(
                `extinguisher-types.json: HTTP ${typesResponse.status}`
            );
        }

        if (!inspectorsResponse.ok) {
            throw new Error(
                `inspectors.json: HTTP ${inspectorsResponse.status}`
            );
        }

        if (!roomsResponse.ok) {
            throw new Error(
                `rooms.json: HTTP ${roomsResponse.status}`
            );
        }

        extinguisherTypes = await typesResponse.json();
        inspectors = await inspectorsResponse.json();
        rooms = await roomsResponse.json();

        inspectors.forEach(inspector => {
            inspector.id = crypto.randomUUID();
        });

        rooms.forEach(room => {
            room.id = crypto.randomUUID();
        });

    } catch (error) {
        console.error("Грешка при зареждане на JSON файловете:", error);
        throw error;
    }
}