import types from "./types";

const addMessage = data => ({
    type: types.ADD_MESSAGE,
    data
})

export default {
    addMessage
}