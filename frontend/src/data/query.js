import { personen } from './personen'

export function checkForOrt(category, place) {
    if (category === "gestorben") {
        checkForSOrt(place)
    }
    if (category === "geboren") {
        checkForGOrt(place)
    }
}

export function checkCategory(category, court) {
    if (category === "Bevölkerung") {
        checkForKaiser(court);
    }
    if (category === "Durschnittsalter") {
        checkForKaiser(court)
    }
    if (category === "Anzahl der Geburten") {
        bornIn(category)
    }
    if (category === "Anzahl der Tode") {
        bornIn(category)
    }

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

function checkForAlive(year) {
    const result = personen.filter(person => ((person.Geburtsdatum <= year) && (person.Todesdatum >= year)));

    return result;
}

function checkForKaiser(kaiserid) {
    const result = personen.filter(person => (person.HofherrID === kaiserid));

    return result;
}

export function checkForAmt(amt, kaiserid) {
    const result = personen
        .filter(person => (person.Amt === amt))
        .filter(person => (person.HofherrID === kaiserid))

    return result;
}

function checkForGeburtso(gort) {
    const result = personen.filter(person => (person.Geburtsort === gort));

    return result;
}

function checkForSterbeo(sort) {
    const result = personen.filter(person => (person.Sterbeort === sort))

    return result;
}

function checkForAliveUnder(start, end, kaiserid) {
    let filtered = personen
        .filter(person => ((person.Geburtsdatum <= start) && (person.Todesdatum >= end)))
        .filter(person => (person.HofherrID === kaiserid))
    return filtered;
}

function checkForBornUnder(year, kaiserid) {
    let filtered = personen
        .filter(person => ((person.Geburtsdatum <= year) && (person.Todesdatum >= year)))
        .filter(person => (person.HofherrID === kaiserid))
    return filtered;
}

function checkForWorkedUnder(amt, kaiserid) {
    let filtered = personen
        .filter(person => ((person.Amt <= amt)))
        .filter(person => (person.HofherrID === kaiserid))
    return filtered;
}

function checkForComeFromUnder(kaiserid, gort) {
    let filtered = personen
        .filter(person => (person.HofherrID === kaiserid))
        .filter(person => (person.Geburtsort === gort))
    return filtered;
}

function checkForDeathsUnder(year, kaiserid) {
    let filtered = personen.filter(person => ((person.Geburtsdatum <= year) && (person.Todesdatum <= year)))
        .filter(person => (person.HofherrID === kaiserid))
    return filtered;
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
