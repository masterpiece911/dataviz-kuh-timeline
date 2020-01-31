import { Orte } from '../data/orte';
import { personen } from '../data/personen';
import { start, end } from './definitions';
import { filterUnknownBirthPlaces, filterUnknownDeathPlaces } from './utilities';


const diedIn = 'Todesort';
const bornIn = 'Geburtsort';
const unknownBirthplace = 'mit unbekanntem Geburtsort';
const unknownPlaceOfDeath = 'mit unbekanntem Todesort';

const query = (setParamOne, setParamTwo) => {
    return ({
        params: [{
                name: `Filter`,
                listOfItems: [
                    diedIn,
                    bornIn,
                    unknownBirthplace,
                    unknownPlaceOfDeath
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
            .map((person) => {
                person['placeOfDeath'] = person.Sterbeort;
                return person;
            });


        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let val = 0;
        for (let year = start; year <= end; year += 1) {
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

    if (category === unknownBirthplace ) {
        // TODO UNFINISHED
        persons = personen
            .filter(!filterUnknownBirthPlaces);
        
        let yearObject = {};
        let yearArray = [];
        let maxVal = 0;
        let val = 0;
        for (let year = start; year <= end; year += 1) {
            yearObject[year] = persons.filter((person) => 
                person.Geburtsdatum <= year && year <= person.Todesdatum
            );
            if (maxVal < yearObject[year].length) {
                maxVal = yearObject[year].length;
            }
            yearArray.push({x: year, y: yearObject[year].length});
        }
        return { persons: yearObject, graph: yearArray, max: maxVal };
    }




    //throw "NOT IMPLEMENTED YET";
    // return {graph: [], persons: {}, max: 0}

}

export default query;
