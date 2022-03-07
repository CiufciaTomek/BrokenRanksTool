import React, { useEffect } from "react";
import { connect } from "react-redux";
import { journalActions } from "../redux/journal/duck";
import { userActions } from "../redux/user/duck";
import LeftBar from "./LeftBar";
import Main from "./Main";
import RightBar from "./RightBar";
import Chat from "./Modals/Chat";
import Settings from "./Modals/Settings";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BrNetwork from "./Network/BrNetwork";

const App = ({ user, journal_total, updateName, loadTotal, loadLanguage, loadShortkeys, shortkeys, updateNetwork }) => {

    useEffect(() => {
        const getNameFromLocalStorage = window.localStorage.getItem('name');
        if (getNameFromLocalStorage) {
            updateName(getNameFromLocalStorage)
        } else if (getNameFromLocalStorage == null) {
            window.localStorage.setItem('name', '')
        }
    }, [])

    useEffect(() => {
        window.localStorage.getItem('journal_total') ? loadTotal(JSON.parse(window.localStorage.getItem('journal_total'))) : window.localStorage.setItem('journal_total', JSON.stringify(journal_total))
        window.localStorage.getItem('language') ? loadLanguage(window.localStorage.getItem('language')) : window.localStorage.setItem('language', "English")
        window.localStorage.getItem('shortkeys') ? loadShortkeys(JSON.parse(window.localStorage.getItem('shortkeys'))) : window.localStorage.setItem('shortkeys', JSON.stringify([]))
    }, [])

    useEffect(() => {
        console.log(shortkeys)
        window.localStorage.setItem('shortkeys', JSON.stringify(shortkeys))
    }, [shortkeys])

    useEffect(() => {
        window.localStorage.setItem('name', user.name)
    }, [user.name])

    return (
        <>
            <BrNetwork />
            <Chat />
            <Settings />
            <LeftBar />
            <Main />
            <RightBar />
            <ToastContainer />
        </>
    )
}

const mapStateToProps = (store) => ({
    user: store.user,
    shortkeys: store.user.shortkeys,
    journal_total: store.journal.total
})

const mapDispatchToProps = dispatch => ({
    updateName: (data) => dispatch(userActions.updateName(data)),
    loadTotal: (data) => dispatch(journalActions.loadTotal(data)),
    loadLanguage: (data) => dispatch(userActions.loadLanguage(data)),
    loadShortkeys: (data) => dispatch(userActions.loadShortkeys(data)),
    updateNetwork: (network) => dispatch(userActions.updateNetwork(network))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)