export const filterForCourt = (court) => (item) => item.HofherrID === court.ID;
export const filterUnknownDeaths = (item) => item.Todesdatum !== "";
export const filterUnknownBirths = (item) => item.Geburtsdatum !== "";
