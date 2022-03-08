import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { backgroundPrimary, backgroundSecondary, primary, rare, secondary, synergetic } from '../Styles'
import CloseIcon from '@mui/icons-material/Close';
import { default as modalActions } from "../../redux/modal/duck/actions";
import { default as userActions } from "../../redux/user/duck/actions";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

const Settings = ({ toggleModal, modal, user, network, language, loadLanguage, shortkeys, addShortKey, loadShortkeys }) => {

    const { t, i18n } = useTranslation();

    const ref = useRef();
    const shortkeyDialogRef = useRef()

    const [channel, setChannel] = useState('main')
    const [inputNetworkValue, setInputNetworkValue] = useState()
    const [selectChoose, selectChange] = useState("Session Restart")
    const [selectLanguage, setLanguage] = useState()
    const [listenKeys, toggleListenKeys] = useState(false)
    const [keyInput, setKeyInput] = useState({ key: null, code: null })
    const [validFalse, setValidFalse] = useState({ text: null, display: false })
    const [isLanguageChanging, setIsLanguageChanging] = useState(false)

    useEffect(() => {
        setLanguage(language)
    }, [language])

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (e.target == ref.current) {
                toggleModal('SETTINGS_MODAL')
            }
        }

        document.addEventListener('mousedown', checkIfClickedOutside)

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside)
        }
    }, [modal])

    useEffect(() => {
        setInputNetworkValue(network.ipv4)
    }, [network])

    useEffect(() => {
        const handleEvent = (e) => {
            setKeyInput({ key: e.key, code: e.code })
        }

        const checkIfClickedOutside = (e) => {
            if (e.target == shortkeyDialogRef.current) {
                toggleListenKeys(!listenKeys)
            }
        }

        document.addEventListener('mousedown', checkIfClickedOutside)

        if (listenKeys) {
            document.addEventListener('keydown', handleEvent)
        }

        return () => {
            document.removeEventListener('keydown', handleEvent)
            document.removeEventListener('mousedown', checkIfClickedOutside)
        }
    }, [listenKeys])

    useEffect(() => {
        if (!selectLanguage) return;
        if (language == selectLanguage) return;
        window.localStorage.setItem('language', selectLanguage)
        setIsLanguageChanging(!isLanguageChanging)
    }, [selectLanguage])

    return (
        <ChatModal display={modal} ref={ref}>
            <ModalContent>
                <Title>{t('Settings')} - {t(channel)} <Icon><CloseIcon onClick={() => toggleModal('SETTINGS_MODAL')} /></Icon> </Title>
                <ModalMenu>
                    <MenuElement onClick={() => setChannel('main')} active={channel == 'main' ? true : false}>{t('main')}</MenuElement>
                    <MenuElement onClick={() => setChannel('network')} active={channel == 'network' ? true : false}>{t('network')}</MenuElement>
                    <MenuElement onClick={() => setChannel('shortkeys')} active={channel == 'shortkeys' ? true : false}>{t('shortkeys')}</MenuElement>
                    <MenuElement onClick={() => setChannel('about')} active={channel == 'about' ? true : false}>{t('about')}</MenuElement>
                    <MenuElement onClick={() => setChannel('changelog')} active={channel == 'changelog' ? true : false}>{t('changelog')}</MenuElement>
                    <MenuFooter lang={i18n.language}>
                        {t('Version')}: 0.1.0
                    </MenuFooter>
                </ModalMenu>

                <Page active={channel == 'main' ? true : false}>
                    {isLanguageChanging ? t("Restart app to apply language changes.") : ''}
                    <Select value={selectLanguage} onChange={(e) => {
                        setLanguage(e.target.value),
                            loadLanguage(e.target.value)
                    }}>
                        <option value="English">English</option>
                        <option value="Polski">Polski</option>
                    </Select>
                </Page>

                <Page active={channel == 'network' ? true : false}>
                    <DevicesInfo>
                        <DeviceDetail>{t('Device')}: {network?.name}</DeviceDetail>
                        <DeviceDetail>{t('Description')}: {network?.description}</DeviceDetail>
                        <DeviceDetail>Ipv4: {network?.ipv4}</DeviceDetail>
                        <DeviceGroup><label>{t('Change ipv4')}:
                            <Input type="text" placeholder="000.000.0.0" minlength="11" maxlength="15" value={inputNetworkValue} onChange={(e) => {
                                setInputNetworkValue(e.target.value)
                            }} />
                        </label>
                            <Btn>{t('Apply')}</Btn>
                        </DeviceGroup>
                    </DevicesInfo>
                </Page>

                <Page active={channel == 'shortkeys' ? true : false}>
                    {shortkeys?.map((e, index) => {
                        return (
                            <ShortKeyGroup>
                                <ShortKey width="150px">
                                    {e.key}
                                </ShortKey>
                                <ShortKey width="180px">
                                    {t(e.action)}
                                </ShortKey>
                                <ShortKey>
                                    <ShortKeyIcon onClick={() => {
                                        loadShortkeys(shortkeys.filter((sKey) => {
                                            return sKey.key !== e.key
                                        }))
                                    }}>
                                        <DeleteIcon />
                                    </ShortKeyIcon>
                                </ShortKey>
                            </ShortKeyGroup>
                        )
                    })}
                    <ShortKeysBottom>
                        <AddBtn onClick={() => {
                            toggleListenKeys(!listenKeys)
                        }}>
                            <AddIcon />
                        </AddBtn>
                    </ShortKeysBottom>
                </Page>

                <Page active={channel == 'about' ? true : false}>
                    Version: 0.1.0
                </Page>

                <Page active={channel == 'changelog' ? true : false}>
                        
                </Page>

                <AddShortkeyDialog show={listenKeys} ref={shortkeyDialogRef}>
                    <DialogContent>
                        <DialogTitle>{t('Choose action and press key for it')}</DialogTitle>
                        {validFalse.display ? (
                            <DialogErro>{t(validFalse.text)}</DialogErro>
                        ) : ''}
                        <Select width="160px" value={selectChoose} onChange={(e) => {
                            selectChange(e.target.value)
                        }}>
                            <option value="Session Restart">{t('Session Restart')}</option>
                            <option value="Session Pause">{t('Session Pause')}</option>
                            <option value="Session Start">{t('Session Start')}</option>
                        </Select>
                        <Input type="text" value={keyInput.code} />
                        <Btn onClick={() => {
                            {
                                keyInput.code ? (
                                    setValidFalse({ text: null, display: false }),
                                    shortkeys?.find((e) => {
                                        return e.action == selectChoose || e.key == keyInput.code
                                    }) ? setValidFalse({ text: "You cannot choose this action/key more than once!", display: true }) : (
                                        addShortKey({ action: selectChoose, key: keyInput.code }),
                                        toggleListenKeys(!listenKeys)
                                    )
                                ) : setValidFalse({ text: "You didn't choose any key!", display: true })
                            }
                        }}>{t('Add shortkey')}</Btn>
                    </DialogContent>
                </AddShortkeyDialog>
            </ModalContent>
        </ChatModal>
    )
}

const ChatModal = styled.div`
width: 100%;
height: 100%;
position: fixed;
background: #333333b5;
display: flex;
flex-wrap: wrap;
flex-direction: column;
align-content: center;
justify-content: center;
z-index: 100;
display: ${props => props.display ? '' : 'none'};
cursor: context-menu;
`

const ModalContent = styled.div`
width: 80%;
display: inline-flex;
justify-content: flex-start;
height: 85%;
align-content: flex-start;
background-color: ${backgroundPrimary};
color: ${primary};
border-radius: 3px;
flex-direction: row;
align-items: flex-start;
padding: 10px;
flex-wrap: wrap;
border: 1px solid #2a2a2a;
`

const Title = styled.div`
display: flex;
align-content: flex-start;
justify-content: space-between;
align-items: center;
text-transform: uppercase;
margin-bottom: 15px;
border-bottom: 1px solid;
padding: 3px;
font-size: 23px;
width: 100%;
height: 30px;
`

const ModalMenu = styled.div`
width: 150px;
display: flex;
justify-content: flex-start;
align-items: flex-start;
height: 100%;
background: #3b3b3b;
text-transform: uppercase;
flex-direction: column;
flex-wrap: wrap;
align-content: flex-start;
height: 90%;
`


const MenuElement = styled.li`
list-style: none;
margin: 10px;
font-size: 18px;
cursor: pointer;
&:hover {
    filter: brightness(0.9);
}
${props => props.active ? 'font-weight:700' : ''};
`

const MenuFooter = styled.div`
width: 95%;
height: ${props => props.lang == 'Polski' ? '57%' : '60%'};
display: flex;
flex-direction: column;
flex-wrap: wrap;
align-content: center;
justify-content: flex-end;
font-size: 11px;
`

const Page = styled.div`
width: 85%;
${props => props.active ? 'display: flex' : 'display: none'};
align-content: flex-start;
justify-content: center;
flex-direction: row;
flex-wrap: wrap;
overflow: auto;
height: 90%;
&::-webkit-scrollbar {
    display: none;
}
`
const ShortKeyGroup = styled.div`
width: 80%;
background-color: ${props => props.findFilter ? '#6FCF97' : backgroundPrimary};
${props => props.index % 2 ? 'filter: brightness(0.9)' : ''};
font-size: 14px;
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-content: center;
justify-content: space-between;
padding: 5px;
text-transform: uppercase;
`

const ShortKey = styled.li`
list-style: none;
padding: 5px;
font-size: 18px;
width: ${props => props.width ? props.width : '150px'};
text-align: center;
`

const ShortKeyIcon = styled.span`
color: ${synergetic};
cursor: pointer;
&:hover {
    filter: brightness(0.9);
}
`

const Icon = styled.span`
cursor: pointer;
${props => props.color ? 'color:' + props.color : ''};

&:hover {
    filter: brightness(0.9);
}
`

const Filters = styled.div`
width:100%;
${props => props.display ? 'display: flex' : 'display: none'};
align-items: center
`

const Input = styled.input`
min-width: 120px;
max-width: 120px;
padding: 5px;
margin: 3px;
background: #3b3b3b;
outline: none;
border-radius: 3px;
color: ${secondary};
text-transform: uppercase;
border: 1px solid #2a2a2a;
`

const Select = styled.select`
min-width: ${props => props.width ? props.width : "120px"};
max-width: ${props => props.width ? props.width : "120px"};
padding: 5px;
margin: 3px;
background: #3b3b3b;
outline: none;
border-radius: 3px;
color: ${secondary};
text-transform: uppercase;
border: 1px solid #2a2a2a;
`

const Keyword = styled.li`
list-style: none;
padding: 3px;
margin-left: 7px;
display: flex;
justify-content: space-between;
`

const KeywordList = styled.div`
${props => props.display ? 'display: flex' : 'display: none'};
flex-direction: column;
width: 90%;
height: 40%;
overflow: auto;
&::-webkit-scrollbar {
    display: none;
}
`

const DevicesInfo = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
width: 95%;
`

const DeviceDetail = styled.p`
text-transform: uppercase;
`

const LanguageInput = styled.input`
`

const Btn = styled.p`
margin: 0;
padding: 8px;
background: #2f4253;
border-radius: 5px;
text-transform: uppercase;
cursor: pointer;
&:hover {
    filter: brightness(0.9);
}
`

const DeviceGroup = styled.div`
display: flex;
flex-direction: row;
align-content: center;
align-items: center;
justify-content: flex-start;
`

const AddBtn = styled.span`
padding: 15px;
background: #27ae60;
border-radius: 26px;
display: flex;
color: #ffffff;
cursor: pointer;
&:hover {
    filter: brightness(0.9);
}
`

const ShortKeysBottom = styled.div`
display: flex;
width: 100%;
justify-content: flex-end;
align-content: center;
align-items: center;
`

const AddShortkeyDialog = styled.div`
position: absolute;
${props => props.show ? "display: flex" : "display: none"};
width: 80%;
height: 85%;
flex-direction: row;
align-items: center;
justify-content: center;
`

const DialogContent = styled.div`
width: 450px;
height: 200px;
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-content: center;
justify-content: center;
align-items: center;
background: ${backgroundSecondary};
`

const DialogTitle = styled.p`
width: 100%;
text-align: center;
margin-top: 0;
`

const DialogErro = styled.p`
width: 100%;
text-align: center;
margin-top: 0;
color: ${synergetic};
`

const mapStateToProps = (state) => ({
    modal: state.modals.data["SETTINGS_MODAL"],
    user: state.user,
    network: state.user.network,
    language: state.user.language,
    shortkeys: state.user.shortkeys
})

const mapDispatchToProps = dispatch => ({
    toggleModal: (modal) => dispatch(modalActions.toggleModal(modal)),
    loadLanguage: (data) => dispatch(userActions.loadLanguage(data)),
    addShortKey: (data) => dispatch(userActions.addShortKey(data)),
    loadShortkeys: (data) => dispatch(userActions.loadShortkeys(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)