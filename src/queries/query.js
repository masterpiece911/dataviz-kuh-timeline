import { personen } from '../data/personen'

const [start, end] = [1503, 1705];

export function checkForOrt(category, place) {
    if (category === "gestorben") {
        return checkForSOrt(place)
    }
    if (category === "geboren") {
        return checkForGOrt(place)
    }
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
