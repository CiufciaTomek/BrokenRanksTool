import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { userActions } from "../../redux/user/duck";
import { messageActions } from '../../redux/message/duck';

const { ipcRenderer } = require('electron')

const BrNetwork = ({ user, updateNetwork, addMessage, updateName }) => {
    useEffect(() => {
        ipcRenderer.removeAllListeners('BR_NETWORK')
        ipcRenderer.send("BR_NETWORK", {type: 'SET'})
        networkHandle()
    },[])

    const networkHandle = () => {
        ipcRenderer.on('BR_NETWORK', (event, arg) => {
            switch(arg.type) {
                case 'NETWORK_SETTING': {
                    return updateNetwork(arg)
                }
                case 'MESSAGE': {
                    return addMessage(arg)
                }
                case 'EQUIPMENT': {
                    return console.log(arg)
                }
                case 'USERNAME': {
                    return updateName(arg.name)
                }
            }
        })
    }

    return (
        <></>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    updateNetwork: (network) => dispatch(userActions.updateNetwork(network)),
    addMessage: (data) => dispatch(messageActions.addMessage(data)),
    updateName: (data) => dispatch(userActions.updateName(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BrNetwork)