export const formatDate = (
    year: string,
    month: string,
    date: string
): string => {
    if (month.length < 2) month = '0' + month
    if (date.length < 2) date = '0' + date

    return `${year}-${month}-${date}`;
}

export const validateDate = (
    year: number,
    month: number,
    date: number
): Error | null => {
    if (isNaN(year) || isNaN(month) || isNaN(date)) {
        return Error('date, month and year must be valid numbers');
    }

    if (month < 1 || month > 12) {
        return Error('month must be between 1 and 12');
    }

    if (date < 1 || date > 31) {
        return Error('date must be between 1 and 31');
    }

    return null;
}