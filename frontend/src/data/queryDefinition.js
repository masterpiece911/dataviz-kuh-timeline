import { kaiser } from './kaiser';
import { checkCaegory } from './data/query';
import { checkForOrt, checkForAmt } from './query';

export const queries = (setParamOne, setParamTwo) => [{
        params: [{
            name: `Kategorie`,
            listOfItems: [
                "Bevoelkerung",
                "Alter",
                "Geburten",
                "Tode",
                "Herkunftsort",
                "Amt"
            ],
            initialValue: 'Bevoelkerung',
            setter: (value) => { setParamOne(value) } // TODO CHANGE FUNCTION
        }],
        title: (category) => {}, // TODO TITLE FUNCTION
        data: (category, court) => { checkCaegory(category, court) }, // TODO DATA FUNCTION
        name: `Demographie` // TODO NAME
    },
    {
        params: [{
                name: `Kategorie`,
                listOfItems: [
                    "Sterbeort",
                    "Herkunftsort"
                ],
                initialValue: 'Herkunftsort',
                setter: (value) => { setParamOne(value) } //TODO CHANGE FUNCTION
            },
            {
                name: `Ort`,
                listOfItems: [
                    // TODO LISTE AN ORTEN
                ],
                initialValue: '',
                setter: (value) => { setParamTwo(value) } //TODO CHANGE FUNCTION
            },
        ],
        title: (category, place) => {}, // TODO TITLE FUNCTION
        data: (category, place) => { checkForOrt(category, place) }, // TODO DATA FUNCTION
        name: `Geographie`
    },
    {
        params: [{
                name: `Amt`,
                listOfItems: [
                    // TODO LISTE AN AEMTERN
                ],
                initialValue: '',
                setter: (value) => { setParamOne(value) } // TODO CHANGE FUNCTION
            },
            {
                name: `Hofstaat`,
                listOfItems: kaiser,
                setter: (value) => { setParamTwo(value) }
            }
        ],
        title: (office, court) => {},
        data: (office, court) => { checkForAmt(office, court) },
        name: `Amt`
    }
]