import { personen } from './personen'

const [start, end] = [1503, 1705];

export function checkForOrt(category, place) {
    if (category === "gestorben") {
        return checkForSOrt(place)
    }
    if (category === "geboren") {
        return checkForGOrt(place)
    }
}

export function checkCategory(category, court) {
    let persons;
    if (category === "Anzahl erfasster Höflinge") {
        persons = checkForKaiser(court);
        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        for (let index = start; index <= end; index += 1) {
            yearObject[index] = persons.filter((person) => person.Geburtsdatum <= index && index <= person.Todesdatum);
            if (maxVal < yearObject[index].length){
                maxVal = yearObject[index].length;
            }
            yearArray.push({ x: index, y: yearObject[index].length });
        }
        return { persons: yearObject, graph: yearArray, max: maxVal };

    }
    if (category === "Durschnittsalter") {
        persons = checkForKaiser(court)
        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let sum = 0;
        let val = 0;
        for (let year = start; year <= end; year += 1) {
            yearObject[year] = persons.filter((person) => person.Geburtsdatum <= year && year <= person.Todesdatum);
            sum = yearObject[year].reduce((prev, person) => {return(prev +year - person.Geburtsdatum)}, 0);
            val = sum / yearObject[year].length;
            if (isNaN(val)) {
                val = 0;
            }
            if (maxVal < val) {
                maxVal = val;
            }
            yearArray.push({x: year, y: val});
        }
        return { persons: yearObject, graph: yearArray, max: maxVal};
    }
    if (category === "Anzahl der Geburten") {
        
        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let sum = 0;
        for (let year = start; year <= end; year += 1) {
            yearObject[year] = personen.filter(person => (person.Geburtsdatum.substring(0, 4) === year));
            sum = yearObject[year].length;
            if (maxVal < sum) {
                maxVal = sum;
            }
            yearArray.push({x: year, y: sum});
        }
        return { persons: yearObject, graph: yearArray, max: maxVal};
    }
    if (category === "Anzahl der Tode") {
        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let sum = 0;
        for (let year = start; year <= end; year += 1) {
            yearObject[year] = personen.filter(person => (person.Todesdatum.substring(0, 4) === year));
            sum = yearObject[year].length;
            if (maxVal < sum) {
                maxVal = sum;
            }
            yearArray.push({x: year, y: sum});
        }
        return { persons: yearObject, graph: yearArray, max: maxVal};
    }

    let yearObject = {};
    let yearArray = [];
    for (let index = start; index <= end; index += 1) {
        yearObject[index] = persons.filter((person) => person.Geburtsdatum <= index && index <= person.Todesdatum);
        yearArray.push({ x: index, y: yearObject[index].length });
    }

    return { persons: yearObject, graph: yearArray };


}

function checkForAlive(year) {
    const result = personen.filter(person => ((person.Geburtsdatum <= year) && (person.Todesdatum >= year)));
    return result;
}

function checkForGOrt(place) {
    let filtered = personen.filter(person => (person.Geburtsort === place))
    return filtered;
}

function checkBorn(place) {
    let filtered = personen.filter(person => (person.Geburtsdatum === place))
    return filtered;
}

function checkDeath(place) {
    let filtered = personen.filter(person => (person.Todesdatum === place))
    return filtered;
}

function checkForSOrt(place) {
    let filtered = personen.filter(person => (person.Sterbeort === place))
    return filtered;
}

function checkForKaiser(court) {
    const result = personen.filter(person => {

        return (person.HofherrID === court.ID)
    });

    return result;
}

export function checkForAmt(amt, kaiserid) {
    const result = personen
        .filter(person => (person.Amt === amt))
        .filter(person => (person.HofherrID === kaiserid))

    return result;
}
function bornIn(category) {
    var geburtsjahre = new Map();
    var todesjahre = new Map();
    for (let i = 1415; i <= 1780; i++) {
        geburtsjahre.set(i, checkBorn(i))
        todesjahre.set(i, checkDeath(i))
    }
    if (category === "Anzahl der Geburten") {
        return geburtsjahre
    }
    if (category === "Anzahl der Tode") {
        return todesjahre
    }
}
