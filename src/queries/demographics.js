import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterPersonForCourt, filterUnknownBirths, filterUnknownDeaths } from './filterFunctions';

const anzErfassterPers = 'Anzahl erfasster Höflinge';
const avgReachedAge = 'durchschnittlich erreichtes Alter';


const query = (setParamOne, setParamTwo, setKaiserIDMethod) => {
  return ({
    params: [
      {
        name: `Filter`,
        listOfItems: [
          anzErfassterPers,
          // avgAgePerYear,
          avgReachedAge,
        ],
        initialValue: avgReachedAge,
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
    title: (category, court) => titleFunction(category, court),
    descriptor: (category, court) => descriptorFunction(category, court),
    data: (category, court) => demographicsData(category, court),
    name: `Demographie`,
  })
}

const titleFunction = (category, court) => {
  return `${category} im Hofstaat ${court}`;
}

const descriptorFunction = (category, court) => {
  if (category === anzErfassterPers) {
    return ('In dem Graphen wurden nur Höflinge verzeichnet, deren Geburtsdatum - oder Todesdatum mindestens das Jahr aufweist - folglich sind Höflinge ohne bekanntes Geburts - oder Todesdatum nicht in diesem Graphen berücksichtigt. Für die Anzahl erfasster Personen wurde jedes Jahr überprüft, ob eine Person eines Hofstaats in diesem Jahr am Leben war. Selbstverständlich müssten Dienstbeginn und Abraitungen auch berücksichtigt werden, jedoch sind Informationen über diese unvollständig.' )
  }
  return ('In dem Graphen wurden nur Höflinge verzeichnet, deren Geburtsdatum - oder Todesdatum mindestens ein Jahr aufweist - folglich sind Höflinge ohne bekanntes Geburts - oder Todesdatum nicht in diesem Graphen berücksichtigt. Das durchschnittlich erreichte Alter pro Jahr ist das durchschnittliche Alter aller Höflinge, welche in diesem Jahr am Leben gewesen sind. Ob diese Höflinge zu dieser Zeit auch am Hof gedient haben, ist leider aufgrund der sehr unvollständigen Informationen zum Dienstbeginn oder der Abraitung einzelner Höflinge nicht berücksichtigt worden.')
}

const demographicsData = (category, court) => {

  let persons;
  if (category === anzErfassterPers) {
    persons = personen.filter(filterPersonForCourt(court));
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let min = parseInt(court.start.substring(0, 4));
    let max = parseInt(court.end.substring(0, 4));
    for (let year = min; year <= max; year += 1) {
      yearObject[year] = persons.filter((person) => person.DATEOFBIRTH <= year && year <= person.DATEOFDEATH);
      if (maxVal < yearObject[year].length) {
        maxVal = yearObject[year].length;
      }
      yearArray.push({ x: year, y: yearObject[year].length });
    }
  
    return { persons: yearObject, graph: yearArray, max: maxVal };

  }

  if (category === avgReachedAge) {
    
    persons = personen
      .filter(filterPersonForCourt(court))
      .filter(filterUnknownBirths)
      .filter(filterUnknownDeaths)
      .map((person) => {
        person['yearOfBirth'] = parseInt(person.DATEOFBIRTH.substring(0, 4));
        person['yearOfDeath'] = parseInt(person.DATEOFDEATH.substring(0, 4));
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

  throw new Error("INVALID PARAMETER IN DEMOGRAPHICS QUERY");

}

export default query;
