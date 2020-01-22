export const initialKaiser = 'F2';

export const kaiser = [{
    "ID": "FR",
    "NAME": "Friedrich\u00a0III.",
    "start": "1415 Sep 21",
    "end": "1493 Aug 19",
    "spalte": "0"
},
{
    "ID": "M1",
    "NAME": "Maximilian\u00a0I.",
    "start": "1459 Mar 22",
    "end": "1519 Jan 12",
    "spalte": "1"
},
{
    "ID": "C5",
    "NAME": "Karl\u00a0V.",
    "start": "1500 Feb 24",
    "end": "1558 Sep 21",
    "spalte": "2"
},
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
    "ID": "ES",
    "NAME": "Ernst",
    "start": "1553 Jun 15",
    "end": "1595 Feb 20",
    "spalte": "2"
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
    "ID": "E2",
    "NAME": "Eleonora\u00a0II.",
    "start": "1598 Sep 23",
    "end": "1655 Jun 27",
    "spalte": "3"
},
{
    "ID": "JC",
    "NAME": "Johann Karl",
    "start": "1605 Nov 01",
    "end": "1619 Dez 26",
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
    "ID": "LW",
    "NAME": "Leopold Wilhelm",
    "start": "1614 Jan 05",
    "end": "1662 Nov 20",
    "spalte": "1"
},
{
    "ID": "A3",
    "NAME": "Anna",
    "start": "1616 Jul 21",
    "end": "1676 Sep 11",
    "spalte": "3"
},
{
    "ID": "E3",
    "NAME": "Eleonora\u00a0III.",
    "start": "1630 Nov 18",
    "end": "1686 Dez 06",
    "spalte": "4"
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
{
    "ID": "CF",
    "NAME": "Klaudia Felizitas",
    "start": "1653 Mai 30",
    "end": "1676 Apr 08",
    "spalte": "5"
},
{
    "ID": "MAT",
    "NAME": "Antonia",
    "start": "1669 Jan 18",
    "end": "1692 Dez 24",
    "spalte": "1"
},
{
    "ID": "J1",
    "NAME": "Joseph\u00a0I.",
    "start": "1678 Jul 26",
    "end": "1711 Apr 17",
    "spalte": "3"
},

{
    "ID": "C6",
    "NAME": "Karl\u00a0VI.",
    "start": "1685 Okt 01",
    "end": "1740 Okt 20",
    "spalte": "2"
},
{
    "ID": "MT",
    "NAME": "Maria Theresia",
    "start": "1717 Mai 13",
    "end": "1780 Nov 29",
    "spalte": "0"
}
]

const getRange = (start, end) => {
    let list = [];
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const data = kaiser.map((k) => {
    let s = parseInt(k.start.substring(0, 4));
    let e = parseInt(k.end.substring(0, 4));
    return ({ id: k.ID, start: s, end: e }
    )
})

const between = (val, min, max) => {
    return min <= val && val <= max;
}

let columnPerYear = {}
let kaisersPerYear = {}

for (const year of getRange(1415, 1780)) {
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

console.log(kaisersPerYear);


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
    let added = false;

    for (const kaiser of kaisers) {
        let selectedKaiser = selected ? kaiser.id === selected : false
        added = false;
        for (const col of getRange(0, maxColumns)) {
            if (columns[col].length === 0) {
                columns[col].push(kaiser)
                added = true;
                if (selectedKaiser) {
                    selectedColumn = col;
                }
                break;
            }

            let length = columns[col].length;

            if (columns[col][length - 1].end <= kaiser.start) {

                columns[col].push(kaiser)
                added = true;
                if (selectedKaiser) {
                    selectedColumn = col;
                }
                break;
            }
        }
    }
    if (selectedColumn && selectedColumn != 0) {
        let zero = columns[0];
        let sel = columns[selectedColumn]
        columns[0] = sel;
        columns[selectedColumn] = zero;
    }
    return columns;
}
