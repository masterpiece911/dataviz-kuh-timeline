import { offices } from '../data/amt';
import { personInOffice } from '../data/personInOffice';
import { kaiser } from '../data/kaiser';
import { personen } from '../data/personen';
import { filterForCourtAndOffice } from './filterFunctions';

const query = (setParamOne, setParamTwo, setKaiserID) => {
    return ({
        params: [{
                name: `Amt`,
                listOfItems: offices,
                field: 'NAME',
                initialValue: offices[48],
                setter: (value) => {
                    setParamOne(value) 
                }
            },
            {
                name: `Hofstaat`,
                listOfItems: kaiser,
                field: 'NAME',
                initialValue: kaiser[4],
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

    let persons = personInOffice
        .filter(filterForCourtAndOffice(court, office))
        .map(pIO => Object.assign(pIO, personen.find(p => p.ID === pIO.ID)))
        .map(p => {
            let startKnown = false; let endKnown = false;
            if (p.START !== ''){
                startKnown = true;
            }
            if (p.END !== '') {
                endKnown = true;
            }
            if (startKnown && endKnown) {
                p['status'] = 'certain';
            } else if (startKnown) {
                p['status'] = 'endUncertain';
            } else if (endKnown) {
                p['status'] = 'beginUncertain';
            } else {
                p['status'] = 'allUncertain';
            }
            return p;
        })
    ;

    let yearObject = {};
    let yearArray = [];
    let maxVal = 0;
    let min = parseInt(court.start.substring(0, 4));
    let max = parseInt(court.end.substring(0, 4));
    
    for (let year = min; year <= max; year += 1) {

        yearObject[year] = [];
        
        let valBeginUncertain = 0;
        let valEndUncertain = 0;
        let valAllUncertain = 0;
        let valCertain = 0;
        let total = 0;
        
        persons.forEach(person => {
            switch(person.status) {
                case 'certain':
                    if(parseInt(person.START.substring(0, 4)) <= year && year <= parseInt(person.END.substring(0, 4))) {
                        valCertain += 1;
                        yearObject[year].push(person);
                    }
                    break;
                case 'beginUncertain':
                    if(year <= parseInt(person.END.substring(0, 4))) {
                        valBeginUncertain += 1;
                        yearObject[year].push(person);
                    }
                    break;
                case 'endUncertain':
                    if(parseInt(person.START.substring(0,4)) <= year) {
                        valEndUncertain += 1;
                        yearObject[year].push(person);
                    }
                    break;
                case 'allUncertain':
                    valAllUncertain += 1;
                    yearObject[year].push(person);
                    break;
                default: throw new Error('something weird happened.');
            }
        });

        total = valCertain + valBeginUncertain + valEndUncertain + valAllUncertain

        if (maxVal < total) {
            maxVal = total;
        }

        yearArray.push({x: year, y: total, y0: valAllUncertain, y1: valAllUncertain + valEndUncertain, y2: valAllUncertain + valEndUncertain + valBeginUncertain});

    }

    let additionalVals = ['Amtszeit unbekannt', 'Ende der Amtszeit unbekannt', 'Anfang der Amtszeit unbekannt'];

    for(let index = additionalVals.length - 1; index > 0; index -= 1) {
        if (yearArray.every(c => c['y'+(index-1)] === c['y' + index])) {
            yearArray.forEach(e => delete e['y' + index]);
            additionalVals.splice(index, 1);
        }
    }
    if (yearArray.every(c => c.y0 === 0)) {
        additionalVals.splice(0, 1);
        yearArray.forEach(e => {
            delete e.y0
            if (additionalVals.length > 0) {
                additionalVals.forEach((v, idx) => {
                    e['y' + idx] = e['y' + (idx + 1)];
                })
            }
        });

    }

    return { persons: yearObject, graph: yearArray, max: maxVal, additional: additionalVals};

    // throw "NOT IMPLEMENTED YET";
    // return {graph: [], persons: {}, max: 0}}

}

export default query;
