import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { backgroundSecondary, primary, secondary, synergetic } from './Styles'
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import { bossList } from '../bossList';
import { userActions } from '../redux/user/duck';
import BugReportIcon from '@mui/icons-material/BugReport';
import { default as modalActions } from "../redux/modal/duck/actions";
import { useTranslation } from 'react-i18next';

const RightBar = ({ journal_total, toggleModal }) => {

    const { t, i18n } = useTranslation();

    return (
        <Bar>
            <Element color={primary}>{t('Journal')}</Element>
            <List color={secondary}>
                <ListRow header={true}>
                    <ListHeader size="65%">{t('Name')}</ListHeader>
                    <ListHeader size="35%">{t('Count')}</ListHeader>
                </ListRow>
                {Object.keys(journal_total)?.map((e, index) => {
                    return (
                        <ListRow index={bossList.find((boss) => boss == e) ? '' : index} background={bossList.find((boss) => boss == e) ? synergetic : primary}>
                            <ListElement size="65%">{e}</ListElement>
                            <ListElement size="35%">{journal_total[e]}</ListElement>
                        </ListRow>
                    )
                })}
            </List>
            <Footer>
                <Icons>
                    <Icon>
                        <ShareIcon fontSize='medium'/>
                    </Icon>
                    <Icon>
                        <BugReportIcon />
                    </Icon>
                    <Icon onClick={() => toggleModal('SETTINGS_MODAL')}>
                        <SettingsIcon />
                    </Icon>
                </Icons>
            </Footer>
        </Bar>
    )
}

const Element = styled.p`
color: ${props => props.color ? props.color : primary};
text-transform: uppercase;
font-size: 18px;
margin-bottom: 0px;
margin-block-start: 10px;
`

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
background-color: ${props => props.background ? props.background : '#828282'};
${props => props.index % 2 ? 'filter: brightness(0.9)' : ''};
${props => props.header ? 'box-shadow: 0px 2px 1px 0px rgb(0 0 0 / 25%)' : ''};
`
const ListElement = styled.li`
width: ${props => props.size ? props.size : '100%'};
text-align: center;
font-size: 12px;
`

const Footer = styled.div`
color: ${props => props.color ? props.color : primary};
margin-top: 7px;
text-align: center;
width: 90%;
display: flex;
justify-content: flex-end;
flex-direction: row;
`

const Icon = styled.span`
&:hover {
    filter: brightness(0.9);
};

`

const Icons = styled.div`
cursor: pointer;
`

const mapStateToProps = (state) => ({
    journal_total: state.journal.total
})

const mapDispatchToProps = dispatch => ({
    toggleModal: (modal) => dispatch(modalActions.toggleModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(RightBar);