import types from './types'

const INITIAL_STATE = {
    mobs: {},
    total: {}
}

const journalReducer = (state = INITIAL_STATE, action) => {
    //console.log(action)
    switch(action.type) {
        case types.UPDATE_JOURNAL:
            return {
                ...state,
                mobs: {...state.mobs, [action.data]: state.mobs[action.data] ? state.mobs[action.data] += 1 : 1}
            }
        case types.LOAD_TOTAL:
            return {
                ...state,
                total: action.data
            }
        case types.UPDATE_TOTAL:
            return {
                ...state,
                total: {...state.total, [action.data]: state.total[action.data] ? state.total[action.data] += 1 : 1}
            }

        default:
            return state
    }
}

export default journalReducer;