export function formatTime(time24) {
    // Split the time string into hours and minutes
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // if hours % 12 is 0, show 12 instead

    return `${hours}:${minutes} ${period}`;
}

// Helper function to format a Date object as ddmmyyyy
export function formatDateToDDMMYYYY(date) {
    const tempDate = new Date(date);
    let day = tempDate.getDate();
    let month = tempDate.getMonth() + 1; // JavaScript months are 0-indexed
    const year = tempDate.getFullYear();

    // Pad day and month with a leading zero if needed
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    return `${day}${month}${year}`;
}