export const filterForCourt = (court) => (item) => item.HofherrID === court.ID;

export const filterUnknownDeaths = (item) => item.Todesdatum !== "";
export const filterKnownDeaths = (item) => item.Todesdatum === "";
export const filterUnknownBirths = (item) => item.Geburtsdatum !== "";
export const filterKnownBirths = (item) => item.Geburtsdatum === "";

export const filterUncertainDateOfBirths = (item) => !item.Geburtsdatum.includes('~');
export const filterCertainDateOfBirths = (item) => item.Geburtsdatum.includes('~');
export const filterUncertainDateOfDeaths = (item) => !item.Todesdatum.includes('~');
export const filterCertainDateOfDeaths = (item) => item.Todesdatum.includes('~');

export const filterIncompleteDateOfBirths = (item) => item.Geburtsdatum.length === 11;
export const filterCompleteDateOfBirths = (item) => item.Geburtsdatum.length !== 11;
export const filterIncompleteDateOfDeaths = (item) => item.Todesdatum.length === 11;
export const filterCompleteDateOfDeaths = (item) => item.Todesdatum.length !== 11;

export const filterUnknownDeathPlaces = (item) => item.Sterbeort !== "";
export const filterKnownDeathPlaces = (item) => item.Sterbeort === "";
export const filterUnknownBirthPlaces = (item) => item.Geburtsort !== "";
export const filterKnownBirthPlaces = (item) => item.Sterbeort === "";

export const filterUnknownOffice = (item) => item.Amt !== "";
