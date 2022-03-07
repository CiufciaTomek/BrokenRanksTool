import types from './types'

const INITIAL_STATE = {
    data: {
        "CHAT_MODAL": false,
        "SETTINGS_MODAL" : false,
    }
}

const messageReducer = (state = INITIAL_STATE, action) => {
    // console.log(action)
    switch (action.type) {
        case types.TOGGLE_MODAL:
            return {
                ...state,
                data: {...state.modals, [action.data]: !state.data[action.data]}
            }
        default:
            return state
    }
}

export default messageReducer;