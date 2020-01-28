import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterForCourt } from './utilities';
import { start, end } from './definitions';

const query = (setParamOne, setParamTwo) => {
  return ({
    params: [
      {
        name: `Kategorie`,
        listOfItems: [
          'Anzahl erfasster Höflinge',
          'Durchschnittsalter',
        ],
        initialValue: 'Anzahl erfasster Höflinge',
        setter: (value) => { setParamOne(value) }
      },
      {
        name: 'Hofstaat',
        listOfItems: kaiser,
        field: 'NAME',
        initialValue: kaiser[0],
        setter: (value) => { setParamTwo(value) }
      }
    ],
    title: (category, court) => titleFunction(category, court),
    data: (category, court) => demographicsData(category, court),
    name: `Demographie`,
  })
}

const titleFunction = (category, court) => {
  return `${category} im Hofstaat von Kaiser ${court}`;
}

const demographicsData = (category, court) => {
  let persons;
  if (category === "Anzahl erfasster Höflinge") {
    persons = personen.filter(filterForCourt(court));
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    for (let index = start; index <= end; index += 1) {
      yearObject[index] = persons.filter((person) => person.Geburtsdatum <= index && index <= person.Todesdatum);
      if (maxVal < yearObject[index].length) {
        maxVal = yearObject[index].length;
      }
      yearArray.push({ x: index, y: yearObject[index].length });
    }
    return { persons: yearObject, graph: yearArray, max: maxVal };

  }
  if (category === "Durschnittsalter") {
    persons = personen.filter(filterForCourt(court));
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let sum = 0;
    let val = 0;
    for (let year = start; year <= end; year += 1) {
      yearObject[year] = persons.filter((person) => person.Geburtsdatum <= year && year <= person.Todesdatum);
      sum = yearObject[year].reduce((prev, person) => { return (prev + year - person.Geburtsdatum) }, 0);
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

  let yearObject = {};
  let yearArray = [];
  for (let index = start; index <= end; index += 1) {
    yearObject[index] = persons.filter((person) => person.Geburtsdatum <= index && index <= person.Todesdatum);
    yearArray.push({ x: index, y: yearObject[index].length });
  }

  return { persons: yearObject, graph: yearArray };

}


export default query;
