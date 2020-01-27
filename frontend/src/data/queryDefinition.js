import { kaiser } from './kaiser';
import { checkCaegory } from './data/query';
import { checkForOrt, checkForAmt } from './query';

export const queries = (setParamOne, setParamTwo) => [
  {
    params: [
      {
        name: `Kategorie`,
        listOfItems: [
          "Bevölkerung",
          "Durschnittsalter",
          "Anzahal geburten",
          "Anzahl der Tode",
          "Herkunftsort der Höflinge",
          "Anzahl der Ämter"
        ],
        initialValue: 'Bevoelkerung',
        setter: (value) => {setParamOne(value)} // TODO CHANGE FUNCTION
      },
      {
        name: 'Hofstaat', 
        listOfItems: kaiser,
        initialValue: 'Kaiser',
        setter: (value) => {setParamTwo(value)}
      }
    ],
    title: (category, court) => `${category} im Hofstaat von Kaiser ${court}`, // TODO TITLE FUNCTION
    data: (category, court) => { checkCaegory(category, court) }, // TODO DATA FUNCTION
    name: `Demographie`, // TODO NAME
  },
  {
    params: [
      {
        name: `Kategorie`,
        listOfItems: [
          "gestorben",
          "geboren"
        ],
        initialValue: 'Herkunftsort',
        setter: (value) => {setParamOne(value)}//TODO CHANGE FUNCTION
      },
      {
        name: `Ort`,
        listOfItems: [
          // TODO LISTE AN ORTEN
        ],
        initialValue: '',
        setter: (value) => {setParamTwo(value)}//TODO CHANGE FUNCTION
      },
    ],
    title: (category, place) => `Höflinge $(category) in $(place)`, // TODO TITLE FUNCTION
    data: (category, place) => { checkForOrt(category, place) }, // TODO DATA FUNCTION
    name: `Geographie`
  },
  {
    params: [
      {
        name: `Amt`,
        listOfItems: [
          // TODO LISTE AN AEMTERN
        ],
        initialValue: '',
        setter: (value) => {setParamOne(value)}// TODO CHANGE FUNCTION
      },
      {
        name: `Hofstaat`,
        listOfItems: kaiser,
        setter: (value) => {setParamTwo(value)}
      }
    ],
    title: (office, court) => `$(office) im Hofstaat von $(court)`,
    data: (office, court) => { checkForAmt(office, court) },
    name: `Amt`
  }
]
