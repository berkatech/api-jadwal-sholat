// convert to yyyy-mm-dd
// note: call function validateDate first before use formatDate
export const formatDate = (
    year: string,
    month: string,
    date: string
): string => {
    const paddedMonth = month.padStart(2, "0");
    const paddedDate = month.padStart(2, "0");

    return `${year}-${paddedMonth}-${paddedDate}`;
}

// validate date
export const validateDate = (
    year: string,
    month: string,
    date: string
): Error | null => {
    const dateNum = parseInt(date, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dateNum)) {
        return Error('date, month and year must be valid numbers');
    }

    if (monthNum < 1 || monthNum > 12) {
        return Error('month must be between 1 and 12');
    }

    if (dateNum < 1 || dateNum > 31) {
        return Error('date must be between 1 and 31');
    }

    return null;
}