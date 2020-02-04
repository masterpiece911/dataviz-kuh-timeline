import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterPersonForCourt, filterKnownBirths, filterKnownDeaths, filterCertainDateOfBirths, filterCertainDateOfDeaths, filterCompleteDateOfBirths, filterCompleteDateOfDeaths, filterIncompleteDateOfBirths, filterIncompleteDateOfDeaths, filterKnownDeathPlaces, filterKnownBirthPlaces, filterUnknownBirthPlaces, filterUnknownDeathPlaces } from './filterFunctions';

const exactDoB = 'vollständiges Geburtsdatum';
const unknownDoB = 'unbekanntes Geburtsdatum';
const uncertainDoB = 'ungenaues Geburtsdatum';
const incompleteDoB = 'unvollständiges Geburtsdatum';
const knownPoB = 'bekannter Geburtsort';
const unknownPoB = 'unbekannter Geburtsort';
const exactDoD = 'vollständiges Todesdatum';
const unknownDoD = 'unbekanntes Todesdatum';
const uncertainDoD = 'ungenaues Todesdatum';
const incompleteDoD = 'unvollständiges Todesdatum';
const knownPoD = 'bekannter Todesort'; 
const unknownPoD = 'unbekannter Todesort';


const queries = [
  exactDoB,
  incompleteDoB,
  uncertainDoB,
  unknownDoB,
  exactDoD,
  incompleteDoD,
  uncertainDoD,
  unknownDoD,
  knownPoB,
  unknownPoB,
  knownPoD,
  unknownPoD
]

const query = (setParamOne, setParamTwo, setKaiserIDMethod) => {
  return ({
    params: [
      {
        name: `Filter`,
        listOfItems: queries,
        initialValue: exactDoB,
        setter: (value) => { setParamOne(value) }
      },
      {
        name: 'Hofstaat',
        listOfItems: kaiser,
        field: 'NAME',
        initialValue: kaiser[1],
        setter: (value) => {
          setKaiserIDMethod(value.ID)
          setParamTwo(value)
        }
      }
    ],
    hasHofstaat: true,
    compare: true,
    title: (category, court) => titleFunction(court, category),
    descriptor: (category, court) => descriptionFunction(category, court),
    data: (category, court) => metadata(court, category),
    name: `Demographie - Metadaten`,
  })
}

const titleFunction = (court, category) => {
  let descriptor;

  switch (category) {
    case exactDoB: descriptor = 'mit vollständigem Geburtsdatum'; break;
    case exactDoD: descriptor = 'mit vollständigem Todesdatum'; break;
    case unknownDoB: descriptor = 'mit unbekanntem Geburtsdatum'; break;
    case unknownDoD: descriptor = 'mit unbekanntem Todesdatum'; break;
    case uncertainDoB: descriptor = 'mit ungenauem Geburtsdatum'; break;
    case uncertainDoD: descriptor = 'mit ungenauem Todesdatum'; break;
    case incompleteDoB: descriptor = 'mit unvollständigem Geburtsdatum'; break;
    case incompleteDoD: descriptor = 'mit unvollständigem Todesdatum'; break;
    case knownPoB: descriptor = 'mit bekanntem Geburtsort'; break;
    case knownPoD: descriptor = 'mit bekanntem Todesort'; break;
    case unknownPoB: descriptor = 'mit unbekanntem Geburtsort'; break;
    case unknownPoD: descriptor = 'mit unbekanntem Todesort'; break;
    default: throw new Error('Unknown category in titleFunction of metaheuristics query');
  }

  return `Höflinge im Hofstaat ${court} ${descriptor}`;
}

const descriptionFunction = (category, court) => {
  return `Der Graph zeigt, anteilig, wie genaue Informationen zum Geburts- oder Todesdatum und -ort vorhanden sind. Ein vollständiges Datum bedeutet Jahr, Tag und Monat sind vorhanden. Ein ungenaues Datum bedeutet, dass im Datumsfeld ein Tilde-Symbol '~' gefunden wurde. Ein leeres Datumsfeld ist als unbekannt bezeichnet.`
}

const metadata = (court, category) => {
  let total = personen
    .filter(filterPersonForCourt(court))
  let totalVal = total.length;
  let persons = personen.filter(filterPersonForCourt(court));

  let min = parseInt(court.start.substring(0, 4));
  let max = parseInt(court.end.substring(0, 4));

  let yearObject = {};
  let yearArray = [];
  let totalArray = [];

  switch (category) {
    case exactDoB: persons = persons.filter(filterIncompleteDateOfBirths); break;
    case exactDoD: persons = persons.filter(filterIncompleteDateOfDeaths); break;
    case unknownDoB: persons = persons.filter(filterKnownBirths); break;
    case unknownDoD: persons = persons.filter(filterKnownDeaths); break;
    case uncertainDoB: persons = persons.filter(filterCertainDateOfBirths); break;
    case uncertainDoD: persons = persons.filter(filterCertainDateOfDeaths); break;
    case incompleteDoB: persons = persons.filter(filterCompleteDateOfBirths); break;
    case incompleteDoD: persons = persons.filter(filterCompleteDateOfDeaths); break;
    case unknownPoB: persons = persons.filter(filterKnownBirthPlaces); break;
    case unknownPoD: persons = persons.filter(filterKnownDeathPlaces); break;
    case knownPoB: persons = persons.filter(filterUnknownBirthPlaces); break;
    case knownPoD: persons = persons.filter(filterUnknownDeathPlaces); break;

    default: throw new Error('Unknown category in data function of metaheuristics query');
  }

  for (let year = min; year <= max; year += 1) {
    yearObject[year] = persons;
    yearArray.push({ x: year, y: persons.length });
    totalArray.push({ x: year, y: totalVal });
  }
  
  return { persons: yearObject, graph: yearArray, total: totalArray, max: totalVal };

}

export default query;
