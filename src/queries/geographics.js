import { Orte } from '../data/orte';
import { personen } from '../data/personen';
import { start, end } from './definitions';
import { filterUnknownDeathPlaces, filterUnknownBirthPlaces } from './filterFunctions';


const diedIn = 'Todesort';
const bornIn = 'Geburtsort';
const start = 1503;
const end = 1705;

const query = (setParamOne, setParamTwo) => {
    return ({
        params: [{
                name: `Filter`,
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
        title: (category, place) => titleFunction(category, place),
        data: (category, place) => { return geographicalData(category, place) },
        name: `Geographie`
    })
}

const titleFunction = (category, place) => {
    switch (category) {
        case diedIn:
            return `Höflinge verstorben in ${place}`
        case bornIn:
            return `Höflinge, aus ${place} abstammend`
        default:
            throw new Error('unknown category in titleFunction of geographics query');
    }
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

        for (let year = start; year <= end; year += 1) {
            yearObject[year] = persons.filter((person) => person.placeOfDeath === place.Ort);
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
        for (let year = start; year <= end; year += 1) {
            yearObject[year] = persons.filter((person) => person.placeOfBirth === place.Ort);
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