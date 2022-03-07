import types from "./types";

const toggleModal = data => ({
    type: types.TOGGLE_MODAL,
    data
})

export default {
    toggleModal
}