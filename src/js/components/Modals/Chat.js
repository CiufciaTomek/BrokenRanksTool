import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { backgroundPrimary, primary, rare, secondary, synergetic } from '../Styles'
import CloseIcon from '@mui/icons-material/Close';
import { default as modalActions } from "../../redux/modal/duck/actions";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Chat = ({ messages, toggleModal, modal }) => {
    const { t, i18n } = useTranslation();

    const ref = useRef();

    const [channel, setChannel] = useState('global')
    const [keyWords, addKeyword] = useState([])
    const [keyWordsInput, setKeywordInput] = useState('')
    const [displayFilters, toggleFilters] = useState(false)

    useEffect(() => {
        if (!window.localStorage.getItem('keywords')) {
            window.localStorage.setItem('keywords', '')
        } else {
            addKeyword(JSON.parse(window.localStorage.getItem('keywords')))
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem('keywords', JSON.stringify(keyWords))
    }, [keyWords.length])

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (e.target == ref.current) {
                toggleModal('CHAT_MODAL')
            }
        }

        document.addEventListener('mousedown', checkIfClickedOutside)

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside)
        }
    }, [modal])

    return (
        <ChatModal display={modal} ref={ref}>
            <ModalContent>
                <Title>{t('Chat history')} <Icon><CloseIcon onClick={() => toggleModal('CHAT_MODAL')} /></Icon> </Title>
                <ModalMenu>
                    <MenuElement onClick={() => setChannel('global')} active={channel == 'global' ? true : false}>{t('Global')}</MenuElement>
                    <MenuElement onClick={() => setChannel('novice')} active={channel == 'novice' ? true : false}>{t('Novice')}</MenuElement>
                    <MenuElement onClick={() => setChannel('expedition')} active={channel == 'expedition' ? true : false}>{t('Expedition')}</MenuElement>
                    <MenuElement onClick={() => setChannel('trade')} active={channel == 'trade' ? true : false}>{t('Trade')}</MenuElement>
                    <MenuElement onClick={() => setChannel('private')} active={channel == 'private' ? true : false}>{t('Private')}</MenuElement>
                    <MenuElement onClick={() => setChannel('guild')} active={channel == 'guild' ? true : false}>{t('Guild')}</MenuElement>
                    <MenuElement onClick={() => toggleFilters(!displayFilters)}>{t('Filters')}</MenuElement>
                    <Filters display={displayFilters}>
                        <Input type="text" placeholder={t('Keyword')} value={keyWordsInput} onChange={(e) => setKeywordInput(e.target.value)} />
                        <Icon>
                            <SendIcon onClick={() => {
                                addKeyword([keyWordsInput, ...keyWords])
                                setKeywordInput('')
                            }} />
                        </Icon>
                    </Filters>
                    <KeywordList display={displayFilters}>
                        {keyWords?.map((e, index) => {
                            return (
                                <Keyword>
                                    {e}
                                    <Icon color={synergetic}>
                                        <DeleteIcon fontSize='small' onClick={() => {
                                            addKeyword(keyWords.filter(kWord => kWord !== e))
                                        }} />
                                    </Icon>
                                </Keyword>
                            )
                        })}
                    </KeywordList>
                </ModalMenu>
                <ContentChat>
                    {messages.data.filter((message) => {
                        return message.channel == channel
                    })?.map((e, index) => {
                        return (
                            <MessageGroup onClick={() => {
                                copy('@' + e.player.split('[')[0])
                                toast.success("Nick copied!", {
                                    theme: "dark",
                                    autoClose: 3000,
                                    position: 'bottom-right'
                                });
                            }} index={index} findFilter={keyWords.find(element => e.message.toLowerCase().includes(element))}>
                                <Message>{e.player + ' [' + e.channel + ']'} </Message>
                                <Message>{e.message}</Message>
                            </MessageGroup>
                        )
                    })}
                </ContentChat>
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

const ContentChat = styled.div`
width: 85%;
display: flex;
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
const MessageGroup = styled.div`
width: 100%;
background-color: ${props => props.findFilter ? '#6FCF97' : backgroundPrimary};
${props => props.index % 2 ? 'filter: brightness(0.9)' : ''};
font-size: 14px;
cursor: pointer;
`

const Message = styled.li`
list-style: none;
padding: 5px;
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
min-width: 110px;
max-width: 110px;
padding: 5px;
margin: 3px;
background: ${backgroundPrimary};
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
height: 38%;
overflow: auto;
&::-webkit-scrollbar {
    display: none;
}
`

const mapStateToProps = (state) => ({
    messages: state.messages,
    modal: state.modals.data["CHAT_MODAL"]
})

const mapDispatchToProps = dispatch => ({
    toggleModal: (modal) => dispatch(modalActions.toggleModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)