import Demographics from '../queries/demographics';
import Demographics_Metadata from '../queries/demographics_metadata';
import Geographics from '../queries/geographics';
import Offices from '../queries/offices';

export const queries = (setParamOne, setParamTwo, setKaiserIDMethod) => [
    Demographics(setParamOne, setParamTwo, setKaiserIDMethod),
    Demographics_Metadata(setParamOne, setParamTwo, setKaiserIDMethod),
    Geographics(setParamOne, setParamTwo),
    Offices(setParamOne, setParamTwo, setKaiserIDMethod),
]
