// Removes "20" from years beginning with that (1999->1999, 2022->22)
export function shortenYear(year) {
    year = year.toString()
    if (/20../.test(year)) return year.slice(-2)
    else return year
}