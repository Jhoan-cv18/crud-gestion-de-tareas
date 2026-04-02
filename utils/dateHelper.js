function getCurrentDate() {
    return new Date().toISOString();
}

function formatDateForDisplay(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-DO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// validar fecha
function isValidISODate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

module.exports = { getCurrentDate, formatDateForDisplay, isValidISODate };
