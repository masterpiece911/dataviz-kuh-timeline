import {kaiser} from './kaiser';

export const queries = (setParamOne, setParamTwo) => [
  {
    params: [
      {
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
        setter: (value) => {setParamOne(value)} // TODO CHANGE FUNCTION
      }
    ],
    title: (category) => {}, // TODO TITLE FUNCTION
    data: () => {},// TODO DATA FUNCTION
    name: `Demographie` // TODO NAME
  },
  {
    params: [
      {
        name: `Kategorie`,
        listOfItems: [
          "Sterbeort",
          "Herkunftsort"
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
    title: (category, place) => {}, // TODO TITLE FUNCTION
    data: () => {}, // TODO DATA FUNCTION
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
    title: (office, court) => {},
    data: () => {},
    name: `Amt`
  }
]
