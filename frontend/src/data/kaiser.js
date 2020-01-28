export const initialKaiser = 'F1';

export const kaiser = [
{
    "ID": "F1",
    "NAME": "Ferdinand\u00a0I.",
    "start": "1503 Mar 10",
    "end": "1564 Jul 25",
    "spalte": "0"
},
{
    "ID": "M2",
    "NAME": "Maximilian\u00a0II.",
    "start": "1527 Jul 31",
    "end": "1576 Okt 12",
    "spalte": "1"
},
{
    "ID": "R2",
    "NAME": "Rudolf\u00a0II.",
    "start": "1552 Jul 18",
    "end": "1612 Jan 20",
    "spalte": "0"
},
{
    "ID": "MS",
    "NAME": "Matthias",
    "start": "1557 Feb 24",
    "end": "1619 Mar 20",
    "spalte": "1"
},
{
    "ID": "F2",
    "NAME": "Ferdinand\u00a0II.",
    "start": "1578 Jul 09",
    "end": "1637 Feb 15",
    "spalte": "4"
},
{
    "ID": "F3",
    "NAME": "Ferdinand\u00a0III.",
    "start": "1608 Jul 13",
    "end": "1657 Apr 02",
    "spalte": "0"
},
{
    "ID": "F4",
    "NAME": "Ferdinand\u00a0IV.",
    "start": "1633 Sep 08",
    "end": "1654 Jul 09",
    "spalte": "5"
},
{
    "ID": "L1",
    "NAME": "Leopold\u00a0I.",
    "start": "1640 Jun 09",
    "end": "1705 Mai 05",
    "spalte": "0"
},
]

const getRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const data = kaiser.map((k) => {
    let s = parseInt(k.start.substring(0, 4));
    let e = parseInt(k.end.substring(0, 4));
    return ({ id: k.ID, name: k.NAME, start: s, end: e }
    )
})

const between = (val, min, max) => {
    return min <= val && val <= max;
}

let columnPerYear = {}
let kaisersPerYear = {}

for (const year of getRange(1503, 1705)) {
    let count = data
        .map((value) => {
            const isInYear = between(year, value.start, value.end);
            if (isInYear) {
                if (!(year.toString() in kaisersPerYear)) {
                    kaisersPerYear[year.toString()] = [];
                }
                kaisersPerYear[year.toString()].push(value);
            }
            return isInYear
        })
        .reduce((prev, cur) => { return cur ? prev + 1 : prev }, 0)

    columnPerYear[year] = count;
}

const uniqueKaisersInRange = (min, max) => {
    let kaisers = [];
    for (const year of getRange(min, max)) {
        kaisersPerYear[year].forEach((value) => {
            if (!kaisers.includes(value)) {
                kaisers.push(value);
            }
        })
    }
    return kaisers;
}

export const getMaxColumnInRange = (min, max) => {
    let maxColumns = 0;
    for (let year = min; year <= max; year++) {
        if (columnPerYear[year] > maxColumns) {
            maxColumns = columnPerYear[year]
        }
    }
    return maxColumns;
}


export const getPositionOfKaisersInRange = (min, max, selected=null) => {

    let selectedColumn = null;
    let kaisers = uniqueKaisersInRange(min, max);
    let maxColumns = getMaxColumnInRange(min, max);
    let columns = {}
    for (const col of getRange(0, maxColumns)) {
        columns[col] = [];
    }

    for (const kaiser of kaisers) {
        let selectedKaiser = selected ? kaiser.id === selected : false
        for (const col of getRange(0, maxColumns)) {
            if (columns[col].length === 0) {
                columns[col].push(kaiser)
                if (selectedKaiser) {
                    selectedColumn = col;
                }
                break;
            }

            let length = columns[col].length;

            if (columns[col][length - 1].end <= kaiser.start) {

                columns[col].push(kaiser)
                if (selectedKaiser) {
                    selectedColumn = col;
                }
                break;
            }
        }
    }
    if (selectedColumn && selectedColumn !== 0) {
        let zero = columns[0];
        let sel = columns[selectedColumn]
        columns[0] = sel;
        columns[selectedColumn] = zero;
    }
    return columns;
}
