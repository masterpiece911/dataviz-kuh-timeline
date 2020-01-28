import Demographics from '../queries/demographics';
import Geographics from '../queries/geographics';
import Offices from '../queries/offices';

export const queries = (setParamOne, setParamTwo, setKaiserIDMethod) => [
    Demographics(setParamOne, setParamTwo, setKaiserIDMethod),
    Geographics(setParamOne, setParamTwo),
    Offices(setParamOne, setParamTwo, setKaiserIDMethod),
]
