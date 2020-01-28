import { Orte } from '../data/orte';
import { personen } from '../data/personen';
import { start, end } from './definitions';

const diedIn = 'Todesort';
const bornIn = 'Geburtsort';

const query = (setParamOne, setParamTwo) => {
  return (
    {
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
    }
  )
}

const geographicalData = (category, place) => {

  let persons;
  // TODO
  throw "NOT IMPLEMENTED YET";
  // return {graph: [], persons: {}, max: 0}

}

export default query;
