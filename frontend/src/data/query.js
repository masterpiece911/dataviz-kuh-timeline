import personen from './data/personen'

function checkForAlive(year) {
    const result = personen.filter(person => ((person.Geburtsdatum <= year) && (person.Todesdatum >= year)));

    return result;
}

function checkForKaiser(kaiserid) {
    const result = personen.filter(person => (person.HofherrID === kaiserid));

    return result;
}

function checkForAmt(amt) {
    const result = personen.filter(person => (person.Amt === amt));

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