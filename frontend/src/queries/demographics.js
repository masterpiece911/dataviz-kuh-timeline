import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterForCourt, filterUnknownBirths, filterUnknownDeaths } from './utilities';
import { start, end } from './definitions';

const anzErfassterPers = 'Anzahl erfasster Höflinge';
// const avgAge = 'Durchschnittsalter';
const avgReachedAge = 'durchschnittlich erreichtes Alter';


const query = (setParamOne, setParamTwo, setKaiserIDMethod) => {
  return ({
    params: [
      {
        name: `Filter`,
        listOfItems: [
          anzErfassterPers,
          // avgAge,
          avgReachedAge,
        ],
        initialValue: anzErfassterPers,
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
    title: (category, court) => titleFunction(category, court),
    data: (category, court) => demographicsData(category, court),
    name: `Demographie`,
  })
}

const titleFunction = (category, court) => {
  return `${category} im Hofstaat ${court}`;
}

const demographicsData = (category, court) => {

  let persons;
  if (category === anzErfassterPers) {
    persons = personen.filter(filterForCourt(court));
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let min = parseInt(court.start.substring(0, 4));
    let max = parseInt(court.end.substring(0, 4));
    for (let year = min; year <= max; year += 1) {
      yearObject[year] = persons.filter((person) => person.Geburtsdatum <= year && year <= person.Todesdatum);
      if (maxVal < yearObject[year].length) {
        maxVal = yearObject[year].length;
      }
      yearArray.push({ x: year, y: yearObject[year].length });
    }
    return { persons: yearObject, graph: yearArray, max: maxVal };

  }

  // if (category === avgAge) {
  //   persons = personen
  //     .filter(filterForCourt(court))
  //     .filter(filterUnknownBirths)
  //     .filter(filterUnknownDeaths)
  //     .map((person) => {
  //       person['yearOfBirth'] = parseInt(person.Geburtsdatum.substring(0, 4));
  //       person['yearOfDeath'] = parseInt(person.Todesdatum.substring(0, 4));
  //       return person;
  //     });

  //   let yearObject = {};
  //   let yearArray = [];
  //   let maxVal = 0;
  //   let sum = 0;
  //   let val = 0;
  //   for (let year = start; year <= end; year += 1) {
  //     yearObject[year] = persons.filter((person) => person.yearOfBirth <= year && year <= person.yearOfDeath);
  //     sum = yearObject[year].reduce((prev, person) => { return (prev + year - person.yearOfBirth) }, 0);
  //     val = sum / yearObject[year].length;
  //     if (isNaN(val)) {
  //       val = 0;
  //     }
  //     if (maxVal < val) {
  //       maxVal = val;
  //     }
  //     yearArray.push({ x: year, y: val });
  //   }
  //   return { persons: yearObject, graph: yearArray, max: maxVal };
  // }
  if (category === avgReachedAge) {
    persons = personen
      .filter(filterForCourt(court))
      .filter(filterUnknownBirths)
      .filter(filterUnknownDeaths)
      .map((person) => {
        person['yearOfBirth'] = parseInt(person.Geburtsdatum.substring(0, 4));
        person['yearOfDeath'] = parseInt(person.Todesdatum.substring(0, 4));
        return person;
      });


    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let sum = 0;
    let val = 0;
    let min = parseInt(court.start.substring(0, 4));
    let max = parseInt(court.end.substring(0, 4));
    for (let year = min; year <= max; year += 1) {
      yearObject[year] = persons.filter((person) => person.yearOfBirth <= year && year <= person.yearOfDeath);
      sum = yearObject[year].reduce((prev, person) => { return (prev + person.yearOfDeath - person.yearOfBirth) }, 0);
      val = sum / yearObject[year].length;
      if (isNaN(val)) {
        val = 0;
      }
      if (maxVal < val) {
        maxVal = val;
      }
      yearArray.push({ x: year, y: val });
    }
    return { persons: yearObject, graph: yearArray, max: maxVal };
  }

  if (category === "Anzahl der Geburten") {

    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let sum = 0;
    for (let year = start; year <= end; year += 1) {
      yearObject[year] = personen.filter(person => (person.Geburtsdatum.substring(0, 4) === year));
      sum = yearObject[year].length;
      if (maxVal < sum) {
        maxVal = sum;
      }
      yearArray.push({ x: year, y: sum });
    }
    return { persons: yearObject, graph: yearArray, max: maxVal };
  }
  if (category === "Anzahl der Tode") {
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let sum = 0;
    for (let year = start; year <= end; year += 1) {
      yearObject[year] = personen.filter(person => (person.Todesdatum.substring(0, 4) === year));
      sum = yearObject[year].length;
      if (maxVal < sum) {
        maxVal = sum;
      }
      yearArray.push({ x: year, y: sum });
    }
    return { persons: yearObject, graph: yearArray, max: maxVal };
  }

  throw "INVALID PARAMETER IN DEMOGRAPHICS QUERY";

}


export default query;
