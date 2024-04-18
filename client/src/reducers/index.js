import { combineReducers } from "redux";
import applications from './applications';
import benefits from './benefits';
import companies from './companies';
import requirements from './requirements';
import titles from './titles';
import score from './score';
import reqResearch from './req_research';
import auth from './auth';
import chiSquareIndep from './chi_square_indep';
import rankings from './ranking';

export default combineReducers({ applications, benefits, companies, requirements,
    titles, score, reqResearch, auth, chiSquareIndep, rankings });