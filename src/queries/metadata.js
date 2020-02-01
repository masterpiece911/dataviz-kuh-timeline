import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterForCourt, filterKnownBirths, filterKnownDeaths, filterCertainDateOfBirths, filterCertainDateOfDeaths, filterKnownBirthPlaces, filterKnownDeathPlaces, filterCompleteDateOfBirths, filterCompleteDateOfDeaths, filterIncompleteDateOfBirths, filterIncompleteDateOfDeaths, filterUnknownBirthPlaces, filterUnknownDeathPlaces } from './filterFunctions';

const exactDoB = 'genaues Geburtsdatum';
const unknownDoB = 'unbekanntes Geburtsdatum';
const knownPoB = 'bekannter Geburtsort';
const unknownPoB = 'unbekannter Geburtsort';
const uncertainDoB = 'ungenaues Geburtsdatum';
const incompleteDoB = 'unvollständiges Geburtsdatum';
const exactDoD = 'genaues Todesdatum';
const unknownDoD = 'unbekanntes Todesdatum';
const knownPoD = 'bekannter Todesort'; 
const unknownPoD = 'unbekannter Todesort';
const uncertainDoD = 'ungenaues Todesdatum';
const incompleteDoD = 'unvollständiges Todesdatum';

const queries = [
  exactDoB,
  incompleteDoB,
  uncertainDoB,
  unknownDoB,
  knownPoB,
  unknownPoB,
  exactDoD,
  incompleteDoD,
  uncertainDoD,
  unknownDoD,
  knownPoD,
  unknownPoD,
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
        initialValue: kaiser[0],
        setter: (value) => {
          setKaiserIDMethod(value.ID)
          setParamTwo(value)
        }
      }
    ],
    hasHofstaat: true,
    compare: true,
    title: (category, court) => titleFunction(court, category),
    data: (category, court) => metaheuristics(court, category),
    name: `Metadaten`,
  })
}

const titleFunction = (court, category) => {
  let descriptor;

  switch (category) {
    case exactDoB: descriptor = 'mit genauem Geburtsdatum'; break;
    case exactDoD: descriptor = 'mit genauem Todesdatum'; break;
    case knownPoB: descriptor = 'mit bekanntem Geburtsort'; break;
    case knownPoD: descriptor = 'mit bekanntem Todesort'; break;
    case unknownDoB: descriptor = 'mit unbekanntem Geburtsdatum'; break;
    case unknownDoD: descriptor = 'mit unbekanntem Todesdatum'; break;
    case uncertainDoB: descriptor = 'mit ungenauem Geburtsdatum'; break;
    case uncertainDoD: descriptor = 'mit ungenauem Todesdatum'; break;
    case unknownPoB: descriptor = 'mit unbekanntem Geburtsort'; break;
    case unknownPoD: descriptor = 'mit unbekanntem Todesort'; break;
    case incompleteDoB: descriptor = 'mit unvollständigem Geburtsdatum'; break;
    case incompleteDoD: descriptor = 'mit unvollständigem Todesdatum'; break;
    default: throw new Error('Unknown category in titleFunction of metaheuristics query');
  }

  return `Höflinge im Hofstaat ${court} ${descriptor}`;
}

const metaheuristics = (court, category) => {
  let total = personen
    .filter(filterForCourt(court))
  let totalVal = total.length;
  let persons = personen.filter(filterForCourt(court));

  let min = parseInt(court.start.substring(0, 4));
  let max = parseInt(court.end.substring(0, 4));

  let yearObject = {};
  let yearArray = [];
  let totalArray = [];

  console.log(category);
  

  switch (category) {
    case exactDoB: persons = persons.filter(filterIncompleteDateOfBirths); break;
    case exactDoD: persons = persons.filter(filterIncompleteDateOfDeaths); break;
    case unknownDoB: persons = persons.filter(filterKnownBirths); break;
    case unknownDoD: persons = persons.filter(filterKnownDeaths); break;
    case uncertainDoB: persons = persons.filter(filterCertainDateOfBirths); break;
    case uncertainDoD: persons = persons.filter(filterCertainDateOfDeaths); break;
    case unknownPoB: persons = persons.filter(filterKnownBirthPlaces); break;
    case unknownPoD: persons = persons.filter(filterKnownDeathPlaces); break;
    case incompleteDoB: persons = persons.filter(filterCompleteDateOfBirths); break;
    case incompleteDoD: persons = persons.filter(filterCompleteDateOfDeaths); break;
    case knownPoB: persons = persons.filter(filterUnknownBirthPlaces); break;
    case knownPoD: persons = persons.filter(filterUnknownDeathPlaces); break;
    default: throw new Error('Unknown category in data function of metaheuristics query');
  }

  for (let year = min; year <= max; year += 1) {
    console.log(persons);
    yearObject[year] = persons;
    yearArray.push({ x: year, y: persons.length });
    totalArray.push({ x: year, y: totalVal });
  }
  console.log('persons', yearObject);
  console.log('graph', yearArray);
  console.log('total', totalArray);
  console.log('max', totalVal + 5);
  
  
  
  
  return { persons: yearObject, graph: yearArray, total: totalArray, max: totalVal };

}

export default query;
