import { kaiser } from './kaiser';
import { Orte as orte } from './orte';
import { aemter } from './amt';
import Demographics from '../queries/demographics';
import { checkForOrt, checkForAmt, } from '../queries/query';

export const queries = (setParamOne, setParamTwo, setKaiserIDMethod) => [
    Demographics(setParamOne, setParamTwo, setKaiserIDMethod),
    {
        params: [{
            name: `Kategorie`,
            listOfItems: [
                "gestorben",
                "geboren"
            ],
            initialValue: 'gestorben',
            setter: (value) => { setParamOne(value) }
        },
        {
            name: `Ort`,
            listOfItems: orte,
            field: 'Ort',
            initialValue: orte[1],
            setter: (value) => { setParamTwo(value) }
        },
        ],
        title: (category, place) => `Höflinge ${category} in ${place}`,
        data: (category, place) => { return checkForOrt(category, place) },
        name: `Geographie`
    },
    {
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
            setter: (value) => { setParamTwo(value) }
        }
        ],
        title: (office, court) => `${office} im Hofstaat von ${court}`,
        data: (office, court) => { return checkForAmt(office, court) },
        name: `Amt`
    }
]
