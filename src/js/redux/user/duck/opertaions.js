import actions from "./actions";
const { ipcRenderer } = require('electron')

// export const operationUpdateName = (data) => {
//     window.localStorage.setItem('name', data);
//     (dispatch) => {
//         dispatch(actions.updateName(data))
//     }
// }

export const testNetwork = () => {
        (dispatch) => {
            ipcRenderer.on('NETWORK_DEVICE', (event, arg) => {
                switch(arg.type) {
                    case 'NETWORK_SETTING': {
                        return dispatch(actions.updateNetwork(arg))
                    }
                }
            })
        }
}