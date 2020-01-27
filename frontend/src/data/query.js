import personen from personen.js

function checkForAlive(year) {
    return (personen.Geburtsdatum <= year && personen.Todesdatum >= year);
}

function checkForKaiser(kaiserid) {
    return (personen.HofherrID == kaiserid)
}

function checkForAmt(amt) {
    return (personen.Amt == amt)
}

function checkForGeburtso(gort) {
    return (personen.Geburtsort == gort);
}

function checkForSterbeo(sort) {
    return (personen.Sterbeort == sort);
}