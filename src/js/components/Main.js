import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { default as userActions } from "../redux/user/duck/actions";
import { default as journalActions } from "../redux/journal/duck/actions";
import { default as modalActions } from '../redux/modal/duck/actions';
import { backgroundSecondary, primary, rare, synergetic } from './Styles';
import ChatIcon from '@mui/icons-material/Chat';
import { messageActions } from '../redux/message/duck';
import { useTranslation } from 'react-i18next';

const { ipcRenderer } = require('electron')

const Main = ({ user, journal, updateExp, updateGold, updateJournal, updateS0, updateS1, updateS8, updateTotal, toggleModal }) => {

    const { t, i18n } = useTranslation();
    console.log(i18n.language)
    const [items, setItem] = useState([])
    const [isWaiting, setWaiting] = useState(1)
    const [mobs, addMob] = useState([])
    const [networkError, setNetworkError] = useState(false)
    

    useEffect(() => {
        ipcRenderer.on('BR_NETWORK', (e, arg) => {
            if(arg.type == 'FIGHT') {
                let getMobs = arg.data.pop()
                addMob(getMobs)
                setItem(arg.data)
                setWaiting(0)
                return
            }
        })
    },[])

    useEffect(() => {
        const find = items?.find((e) => {
            return e.name == user.name
        })
        if (find?.exp) {
            updateExp(user.exp + parseInt(find?.exp))
        }
        if (find?.gold) {
            updateGold(user.gold + parseInt(find?.gold))
        }
        if (mobs.length) {
            for (let mob of mobs) {
                updateJournal(mob)
                updateTotal(mob)
                window.localStorage.setItem('journal_total', JSON.stringify(journal.total))
            }
        }
        if (find?.items) {
            let drop = []
            let ddupa = {
                '0': 0,
                '1': 0,
                '8': 0
            }
            drop = find?.items.split(']  ');
            for (let item of drop) {
                ddupa = {
                    ...ddupa,
                    [item[2]]: ddupa[item[2]] += 1
                }
            }

            if (ddupa['0'] > 0) {
                updateS0(user.s0 += ddupa['0'])
            }
            if (ddupa['1'] > 0) {
                updateS1(user.s1 += ddupa['1'])
            }
            if (ddupa['8'] > 0) {
                updateS8(user.s8 += ddupa['8'])
            }
        }

    }, [items])


    return (
        <Mainn>
            {isWaiting ? (
                <Header>
                    {t('Waiting for fight')}
                </Header>
            ) : ''}
            {user.name == 'default' ? (
                <Error>
                    {t('Username was not found')}
                </Error>
            ) : ''}
            {networkError ? (
                <Error>
                    Duupa sie stała nie ma ipv4
                </Error>
            ) : ''}
            <List>
                {items?.map((e, index) => {
                    return (
                        <Group bg={index % 2}>
                            <Element size="120px">{e.name}</Element>
                            <Element size="60px">{e.exp}</Element>
                            <Element size="60px">{e.gold}</Element>
                            <Element size="310px" direction="row">
                                {e.items?.split(']  ').map((el) => {
                                    return (
                                        <Element rarity={el[2]} font="13px">
                                            {el.replace(/\[(.*?)\]/g, ' ').replace(/\[\/rr/g, '').replace(/s.*?\]/g, '').toString()}
                                        </Element>
                                    )
                                })}</Element>
                            <Element size="250px">
                                {e.others?.split(') ').map((el) => {
                                    return (
                                        <Element rarity={el[2]} font="13px">
                                            {el}
                                        </Element>
                                    )
                                })}
                            </Element>
                        </Group>
                    )
                })}
            </List>
            <Bottom>
                <Icon onClick={() => toggleModal("CHAT_MODAL")}>
                    <ChatIcon />
                </Icon>
            </Bottom>
        </Mainn>
    )



}
const Mainn = styled.div`
color: #ffffff;
min-width: 850px;
max-width: 850px;
display: inline-flex;
align-content: center;
align-items: center;
justify-content: space-between;
margin: 5px;
padding: 6.5px;
flex-direction: column;
flex-wrap: wrap;
cursor: context-menu;
`;

const List = styled.div`
display: flex;
flex-wrap: wrap;
margin: 5px 10px;
flex: flex-grow;
flex-basis: auto;
flex-shrink: inherit;
text-transform: uppercase;
`;
const Element = styled.li`
text-align: center;
list-style: none;
margin: 5px;
display: inline-flex;
align-items: center;
flex-wrap: wrap;
color: ${props => props.rarity == 8 ? synergetic : (props.rarity == 1 ? rare : "#ffffff")};
font-size: ${props => props.font ? props.font : "18px"};
max-width: ${props => props.size ? props.size : "unset"};
min-width: ${props => props.size ? props.size : "unset"};
flex-direction: ${props => props.direction ? props.direction : "column"};
width: 100%;
`;
const Group = styled.div`
padding: 5px;
min-width: 850px;
max-width: 850px;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
-webkit-flex-wrap: wrap;
-ms-flex-wrap: wrap;
max-height: 150px;
flex-wrap: wrap;
flex-direction: row;
align-content: center;
justify-content: flex-start;
align-items: center;
background-color: ${backgroundSecondary};
`;
const Error = styled.p`
color: ${synergetic};
`

const Header = styled.p`
font-size: 24px;
text-transform: uppercase;
color: ${primary};
`

const Bottom = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
align-content: center;
align-items: center;
`

const Icon = styled.span`
padding: 15px;
background: #2568a3;
border-radius: 25px;
display: flex;
cursor: pointer;

&:hover {
    filter: brightness(0.9);
}
`
const mapDispatchToProps = dispatch => ({
    updateExp: (exp) => dispatch(userActions.exp(exp)),
    updateGold: (gold) => dispatch(userActions.gold(gold)),
    updateJournal: (data) => dispatch(journalActions.updateJournal(data)),
    updateS0: (data) => dispatch(userActions.updateS0(data)),
    updateS1: (data) => dispatch(userActions.updateS1(data)),
    updateS8: (data) => dispatch(userActions.updateS8(data)),
    updateTotal: (data) => dispatch(journalActions.updateTotal(data)),
    toggleModal: (modal) => dispatch(modalActions.toggleModal(modal)),
})

const mapStateToProps = (state) => ({
    user: state.user,
    journal: state.journal
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)