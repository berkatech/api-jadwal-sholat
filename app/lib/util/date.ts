export const formatDate = (
    year: string,
    month: string,
    date: string
): string => {
    if (month.length < 2) month = '0' + month
    if (date.length < 2) date = '0' + date

    return `${year}-${month}-${date}`;
}