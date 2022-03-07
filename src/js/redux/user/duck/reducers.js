import types from './types'

const INITIAL_STATE = {
    name: 'default',
    modal: false,
    exp: 0,
    gold: 0,
    s0: 0,
    s1: 0,
    s8: 0,
    network: {
        name: null,
        desc: null,
        ipv4: null,
    },
    language: 'English',
    shortkeys: []
}

const userReducer = (state = INITIAL_STATE, action) => {
    //console.log(action)
    //console.log(state)
    switch (action.type) {
        case types.ADD_EXP:
            return {
                ...state,
                exp: action.data
            }
        case types.ADD_GOLD:
            return {
                ...state,
                gold: action.data
            }
        case types.ADD_S0:
            return {
                ...state,
                s0: action.data
            }
        case types.ADD_S1:
            return {
                ...state,
                s1: action.data
            }
        case types.ADD_S8:
            return {
                ...state,
                s8: action.data
            }
        case types.UPDATE_NAME:
            return {
                ...state,
                name: action.data
            }
        case types.TOGGLE_MODAL:
            return {
                ...state,
                modal: !state.modal
            }
        case types.RESTART_SESSION:
            return {
                ...state,
                exp: 0,
                gold: 0,
                s0: 0,
                s1: 0,
                s8: 0
            }
        case types.UPDATE_NETWORK:
            return {
                ...state,
                network: action.data
            }
        case types.LOAD_LANGUAGE:
            return {
                ...state,
                language: action.data
            }
        case types.LOAD_SHORTKEYS:
            return {
                ...state,
                shortkeys: action.data
            }
        case types.ADD_SHORTKEY:
            return {
                ...state,
                shortkeys: [...state.shortkeys, action.data]
            }
        default:
            return state
    }
}

export default userReducer;