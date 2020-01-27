import personen from personen.js

function checkForAlive(year) {
    const result = personen.filter(person => ((personen.Geburtsdatum <= year) && (personen.Todesdatum >= year)));

    return result;
}

function checkForKaiser(kaiserid) {
    const result = personen.filter(person => (personen.HofherrID == kaiserid));

    return result;
}

function checkForAmt(amt) {
    const result = personen.filter(person => (personen.Amt == amt));

    return result;
}

function checkForGeburtso(gort) {
    const result = personen.filter(person => (personen.Geburtsort == gort));

    return result;
}

function checkForSterbeo(sort) {
    const result = personen.filter(person => (personen.Sterbeort == sort));

    return result;
}