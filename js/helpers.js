
function findById(items, id) {
    return items.find(item => item.id === id);
}

function formatDate(date) {
    if (!date) return "—";
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

function formatMonth(month) {
    if (!month) return "—";
    const [year, monthNumber] = month.split("-");
    return `${monthNumber}.${year}`;
}
