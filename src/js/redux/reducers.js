import { combineReducers } from "redux";
import userReducer from "./user/duck";
import journalReducer from './journal/duck'
import messageReducer from "./message/duck";
import modalReducer from "./modal/duck";

const rootReducer = combineReducers({
    user: userReducer,
    journal: journalReducer,
    messages: messageReducer,
    modals: modalReducer
});

export default rootReducer;