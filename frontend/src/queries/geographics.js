import { Orte } from '../data/orte';
import { personen } from '../data/personen';
import { start, end } from './definitions';
import { filterUnknownBirthPlaces, filterUnknownDeathPlaces } from './utilities';


const diedIn = 'Todesort';
const bornIn = 'Geburtsort';

const query = (setParamOne, setParamTwo) => {
    return ({
        params: [{
                name: `Kategorie`,
                listOfItems: [
                    diedIn,
                    bornIn,
                ],
                initialValue: diedIn,
                setter: (value) => { setParamOne(value) }
            },
            {
                name: `Ort`,
                listOfItems: Orte,
                field: 'Ort',
                initialValue: Orte[1],
                setter: (value) => { setParamTwo(value) }
            },
        ],
        title: (category, place) => `Höflinge ${category} in ${place}`,
        data: (category, place) => { return geographicalData(category, place) },
        name: `Geographie`
    })
}

const geographicalData = (category, place) => {

    let persons;
    // TODO
    if (category === diedIn) {
        persons = personen
            .filter(filterUnknownDeathPlaces)
            .map((person) => {
                person['placeOfDeath'] = person.Sterbeort;
                return person;
            });


        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let val = 0;
        let min = parseInt(court.start.substring(0, 4));
        let max = parseInt(court.end.substring(0, 4));
        for (let year = min; year <= max; year += 1) {
            yearObject[year] = persons.filter((person) => person.placeOfDeath === place);
            val = yearObject[year].length;
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
    if (category === bornIn) {
        persons = personen
            .filter(filterUnknownBirthPlaces)
            .map((person) => {
                person['placeOfBirth'] = person.Geburtsort;
                return person;
            });


        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let val = 0;
        let min = parseInt(court.start.substring(0, 4));
        let max = parseInt(court.end.substring(0, 4));
        for (let year = min; year <= max; year += 1) {
            yearObject[year] = persons.filter((person) => person.placeOfBirth === place);
            val = yearObject[year].length;
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






    //throw "NOT IMPLEMENTED YET";
    // return {graph: [], persons: {}, max: 0}

}

export default query;