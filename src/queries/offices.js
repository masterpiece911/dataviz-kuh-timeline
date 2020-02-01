import { aemter } from '../data/amt';
import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterForCourt } from './filterFunctions';

const query = (setParamOne, setParamTwo, setKaiserID) => {
    return ({
        params: [{
                name: `Amt`,
                listOfItems: aemter,
                field: 'Hofamt',
                initialValue: aemter[3],
                setter: (value) => { setParamOne(value) }
            },
            {
                name: `Hofstaat`,
                listOfItems: kaiser,
                field: 'NAME',
                initialValue: kaiser[0],
                setter: (value) => {
                    setKaiserID(value.ID)
                    setParamTwo(value)
                }
            }
        ],
        hasHofstaat: true,
        compare: true,
        title: (office, court) => `Anzahl ${office} im Hofstaat von ${court}`,
        data: (office, court) => { return officeData(office, court) },
        name: `Amt`
    })
}

const officeData = (office, court) => {

    let persons;
    persons = personen
        .filter(filterForCourt(court))
            // .filter(filterUnknownOffice)
        .map((person) => {
            person['office'] = person.Amt;
            return person;
        });
    
    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let val = 0;
    let min = parseInt(court.start.substring(0, 4));
    let max = parseInt(court.end.substring(0, 4));
    
    for (let year = min; year <= max; year += 1) {
        
        yearObject[year] = persons.filter((person) => person.office === office.Hofamt);
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

    // throw "NOT IMPLEMENTED YET";
    // return {graph: [], persons: {}, max: 0}}

}

export default query;
