import types from './types'

const INITIAL_STATE = {
    data: []
}

const messageReducer = (state = INITIAL_STATE, action) => {
    // console.log(action)
    switch (action.type) {
        case types.ADD_MESSAGE:
            return {
                ...state,
                data: [action.data, ...state.data,]
            }
        default:
            return state
    }
}

export default messageReducer;