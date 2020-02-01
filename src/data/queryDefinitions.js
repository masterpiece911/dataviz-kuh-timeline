import Demographics from '../queries/demographics';
import Metadata from '../queries/metadata';
import Geographics from '../queries/geographics';
import Offices from '../queries/offices';

export const queries = (setParamOne, setParamTwo, setKaiserIDMethod) => [
    Demographics(setParamOne, setParamTwo, setKaiserIDMethod),
    Metadata(setParamOne, setParamTwo, setKaiserIDMethod),
    Geographics(setParamOne, setParamTwo),
    Offices(setParamOne, setParamTwo, setKaiserIDMethod),
]
