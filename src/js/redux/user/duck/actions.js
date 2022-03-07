import types from "./types";

const exp = data => ({
    type: types.ADD_EXP,
    data
})

const gold = data => ({
    type: types.ADD_GOLD,
    data
})

const updateS0 = data => ({
    type: types.ADD_S0,
    data
})

const updateS1 = data => ({
    type: types.ADD_S1,
    data
})

const updateS8 = data => ({
    type: types.ADD_S8,
    data
})

const updateName = data => ({
    type: types.UPDATE_NAME,
    data
})

const toggleModal = () => ({
    type: types.TOGGLE_MODAL
})

const restartSession = () => ({
    type: types.RESTART_SESSION
})

const updateNetwork = data => ({
    type: types.UPDATE_NETWORK,
    data
})

const loadLanguage = data => ({
    type: types.LOAD_LANGUAGE,
    data
})

const loadShortkeys = data => ({
    type: types.LOAD_SHORTKEYS,
    data
})

const addShortKey = data => ({
    type: types.ADD_SHORTKEY,
    data
})

export default {
    exp,
    gold,
    updateS0,
    updateS1,
    updateS8,
    updateName,
    toggleModal,
    restartSession,
    updateNetwork,
    loadLanguage,
    loadShortkeys,
    addShortKey
}