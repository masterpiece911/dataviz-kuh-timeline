import {personInCourt} from '../data/personInCourt';

export const filterPersonForCourt = (court) => (item) => {
  return personInCourt.filter(e=> e.COURT === court.ID).some(e => e.ID === item.ID);
};

export const filterForCourtAndOffice = (court, office) => (item) => item.COURT === court.ID && item.OFFICE === office.ID;

export const filterUnknownStartOfOffice = (item) => item.START !== "";
export const filterKnownStartOfOffice = (item) => item.START === "";
export const filterUnknownEndOfOffice = (item) => item.END !== "";
export const filterKnownEndOfOffice = (item) => item.END === "";

export const filterUnknownDeaths = (item) => item.DATEOFDEATH !== "";
export const filterKnownDeaths = (item) => item.DATEOFDEATH === "";
export const filterUnknownBirths = (item) => item.DATEOFBIRTH !== "";
export const filterKnownBirths = (item) => item.DATEOFBIRTH === "";

export const filterUncertainDateOfBirths = (item) => !item.DATEOFBIRTH.includes('~');
export const filterCertainDateOfBirths = (item) => item.DATEOFBIRTH.includes('~');
export const filterUncertainDateOfDeaths = (item) => !item.DATEOFDEATH.includes('~');
export const filterCertainDateOfDeaths = (item) => item.DATEOFDEATH.includes('~');

export const filterIncompleteDateOfBirths = (item) => item.DATEOFBIRTH.length === 11;
export const filterCompleteDateOfBirths = (item) => item.DATEOFBIRTH.length !== 11;
export const filterIncompleteDateOfDeaths = (item) => item.DATEOFDEATH.length === 11;
export const filterCompleteDateOfDeaths = (item) => item.DATEOFDEATH.length !== 11;

export const filterUnknownDeathPlaces = (item) => item.PLACEOFDEATH !== "";
export const filterKnownDeathPlaces = (item) => item.PLACEOFDEATH === "";
export const filterUnknownBirthPlaces = (item) => item.PLACEOFBIRTH !== "";
export const filterKnownBirthPlaces = (item) => item.PLACEOFBIRTH === "";

export const filterUnknownOffice = (item) => item.Amt !== "";
