import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { backgroundSecondary, common, epic, primary, rare, secondary, synergetic } from './Styles'
import { connect } from 'react-redux';
import numeral from 'numeral';
import { useTimer } from 'use-timer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { toast } from 'react-toastify';
import { userActions } from '../redux/user/duck';
import { useTranslation } from 'react-i18next';

const convert = require('convert-seconds');

const LeftBar = ({ user, journal, restartSession, shortkeys }) => {
    const { t, i18n } = useTranslation();

    const [expPerHour, updateExpPerHour] = useState(0)
    const [goldPerHour, updateGoldPerHour] = useState(0)
    const [durationTime, updatedurationTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const { time, start, pause, reset, status } = useTimer({
        autostart: true,
        onTimeUpdate: (time) => {
            updateExpPerHour(Math.round(user.exp / (time / 3600)));
            updateGoldPerHour(Math.round(user.gold / (time / 3600)))
            updatedurationTime(convert(time));
        }
    });

    const resetTimer = () => {
        updateExpPerHour(0)
        updateGoldPerHour(0)
        restartSession()
        reset()
        start()
        toast.success("Session has been restarted!", {
            theme: "dark",
            autoClose: 3000,
            position: 'bottom-right'
        })
    }

    useEffect(() => {
        //console.log(journal)
    }, [])

    const handleKeyPress = (e) => {
        let find = shortkeys.find((element) => {
            return e.key == element.key
        })
        console.log(find)
        switch (find?.action) {
            case "Session Restart": {
                updateExpPerHour(0)
                updateGoldPerHour(0)
                restartSession()
                reset()
                start()

                toast.success("Session has been restarted!", {
                    theme: "dark",
                    autoClose: 3000,
                    position: 'bottom-right'
                })
            }
                break;

            case "Session Pause": {
                pause()
                toast.info("Session has been stopped!", {
                    theme: "dark",
                    autoClose: 2000,
                    position: 'bottom-right'
                })
            }
                break;
            case "Session Start": {
                toast.info("Session has been started!", {
                    theme: "dark",
                    autoClose: 2000,
                    position: 'bottom-right'
                })
                start()
            }
                break;
        }
    }

    useEffect(() => {

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    return (
        <Bar>
            <Element color={primary}>{t('Session')}</Element>
            <Element color={secondary}>{
                durationTime?.hours +
                ":" +
                durationTime?.minutes +
                ":" +
                durationTime?.seconds
            }
            </Element>
            <Group>
                <Element color={primary}>exp/h: {expPerHour ? numeral(expPerHour).format('0 a') : 0}</Element>
                <Element color={primary}>exp: {numeral(user?.exp).format('0 a')}</Element>
                <Element color={primary}>gold/h: {goldPerHour ? numeral(goldPerHour).format('0 a') : 0}</Element>
                <Element color={primary}>gold: {numeral(user?.gold).format('0 a')}</Element>
            </Group>
            <Group>
                <Element color={common}>{t('Common')}: {user.s0}</Element>
                <Element color={synergetic}>{t('Synergetic')}: {user.s8}</Element>
                <Element color={rare}>{t('Rare')}: {user.s1}</Element>
                <Element color={epic}>{t('Epic')}: 0</Element>
            </Group>
            <List color={secondary}>
                <ListRow header={true}>
                    <ListHeader size="65%">{t('Name')}</ListHeader>
                    <ListHeader size="35%">{t('Count')}</ListHeader>
                </ListRow>
                {Object.keys(journal.mobs).map((e, index) => {
                    return (
                        <ListRow index={index}>
                            <ListElement size="65%">{e}</ListElement>
                            <ListElement size="35%">{journal.mobs[e]}</ListElement>
                        </ListRow>
                    )
                })}
            </List>
            <Footer>
                {t('Logged as')}: {user?.name ? user.name : undefined}
            </Footer>
            <Icons>
                <Icon onClick={() => {
                    toast.info("Session has been started!", {
                        theme: "dark",
                        autoClose: 2000,
                        position: 'bottom-right'
                    })
                    start()
                }}>
                    <PlayArrowIcon />
                </Icon>
                <Icon onClick={() => {
                    pause()
                    toast.info("Session has been stopped!", {
                        theme: "dark",
                        autoClose: 2000,
                        position: 'bottom-right'
                    })
                }}>
                    <PauseIcon />
                </Icon>
                <Icon onClick={() => {
                    resetTimer()
                }}>
                    <RestartAltIcon />
                </Icon>
            </Icons>
        </Bar>
    )
}

const Bar = styled.div`
background-color: ${backgroundSecondary};
width: 200px;
height: 100%;
display: flex;
flex-wrap: nowrap;
flex-direction: column;
align-content: center;
justify-content: flex-start;
align-items: center;
cursor: context-menu;
`

const Element = styled.p`
color: ${props => props.color ? props.color : primary};
text-transform: uppercase;
font-size: 18px;
margin-bottom: 0px;
margin-block-start: 10px;
`

const Group = styled.div`
width: 85%;
display: flex;
flex-direction: column;
flex-wrap: wrap;
align-content: flex-start;
justify-content: center;
align-items: flex-start;
margin-top: 5px;
`

const List = styled.div`
width: 95%;
list-style: none;
display: flex;
flex-wrap: wrap;
align-items: center;
align-content: flex-start;
justify-content: center;
background-color: #828282;
color: ${props => props.color ? props.color : primary};
min-height: 290px;
max-height: 290px;
margin-top: 7px;
overflow: auto;
&::-webkit-scrollbar {
    display: none;
}
`

const ListHeader = styled.li`
width: ${props => props.size ? props.size : '100%'};
text-align: center;
font-size: 13px;
`

const ListRow = styled.li`
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-items: center;
width: 100%;
align-content: center;
text-align: center;
margin-top: 3px;
background-color: #828282;
${props => props.index % 2 ? 'filter: brightness(0.9)' : ''};
${props => props.header ? 'box-shadow: 0px 2px 1px 0px rgb(0 0 0 / 25%)' : ''};
`
const ListElement = styled.li`
width: ${props => props.size ? props.size : '100%'};
text-align: center;
font-size: 12px;
`

const Footer = styled.p`
text-transform: uppercase;
font-size: 14px;
color: ${props => props.color ? props.color : primary};
margin-top: 7px;
text-align: center;
margin-bottom: 10px;
`

const Icon = styled.span`
&:hover {
    filter: brightness(0.9);
}
cursor: pointer;
`

const Icons = styled.div`
width: 100%;
display: flex;
justify-content: space-evenly;
flex-direction: row;
color: ${primary};
`

const mapStateToProps = (state) => ({
    user: state.user,
    journal: state.journal,
    shortkeys: state.user.shortkeys
})

const mapDispatchToProps = dispatch => ({
    restartSession: () => dispatch(userActions.restartSession())
})

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar);