import types from "./types";

const updateJournal = data => ({
    type: types.UPDATE_JOURNAL,
    data
})

const updateTotal = data => ({
    type: types.UPDATE_TOTAL,
    data
})

const loadTotal = data => ({
    type: types.LOAD_TOTAL,
    data
})

export default {
    updateJournal,
    updateTotal,
    loadTotal
}