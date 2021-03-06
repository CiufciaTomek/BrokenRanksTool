import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    English: {
        translation: {
            "Waiting for fight": "Waiting for fight...",
            "Username was not found": "Username was not found, try to relog.",
            "Session": "Session",
            "Common": "Common",
            "Synergetic": "Synergetic",
            "Rare": "Rare",
            "Epic": "Epic",
            "Name": "Name",
            "Count": "Count",
            "Logged as": "Logged as",
            "Journal": "Journal",
            "Chat history": "Chat history",
            "Global": "Global",
            "Novice": "Novice",
            "Trade": "Trade",
            "Private": "Private",
            "Guild": "Guild",
            "Expedition": "Expedition",
            "Filters": "Filters",
            "Settings": "Settings",
            "main":"Main",
            "network":"network",
            "shortkeys":"shortkeys",
            "about":"about",
            "Device":"Device",
            "Description":"Description",
            "Change ipv4":"Change ipv4",
            "Session Restart":"Session restart",
            "Session Pause":"Session pause",
            "Session Start":"Session start",
            "Choose action and press key for it":"Choose action and press key for it",
            "You cannot choose this action/key more than once!":"You cannot choose this action/key more than once",
            "Add shortkey":"Add shortkey",
            "Keyword":"Keyword",
            "Version": "Version",
            "Apply": "Apply",
            "You didn't choose any key!": "You didn't choose any key!",
            "Restart app to apply language changes.": "Restart app to apply language changes."
        }
    },
    Polski: {
        translation: {
            "Waiting for fight": "Oczekiwanie na koniec walki...",
            "Username was not found": "B????d z pobieraniem nazwy u??ytkownika, spr??buj zalogowa?? si?? ponownie.",
            "Session": "Sesja",
            "Common": "Zwyk??y",
            "Synergetic": "Synergetyk",
            "Rare": "Rzadki",
            "Epic": "Epicki",
            "Name": "Nazwa",
            "Count": "Ilo????",
            "Logged as": "Zalogowany jako",
            "Journal": "Dziennik",
            "Chat history": "Historia czatu",
            "Global": "Globalny",
            "Novice": "Nowicjuszy",
            "Trade": "Handlowy",
            "Private": "Prywatny",
            "Guild": "Gildyjny",
            "Expedition": "Wyprawowy",
            "Filters": "Filtry",
            "Settings": "Ustawienia",
            "main":"G????wne",
            "network":"Sieciowe",
            "shortkeys":"Skr??ty klawiszowe",
            "about":"O projekcie",
            "Device":"Urz??dzenie",
            "Description":"Opis",
            "Change ipv4":"Zmie?? ipv4",
            "Session Restart":"Restart sesji",
            "Session Pause":"Pauza sesji",
            "Session Start":"Start sesji",
            "Choose action and press key for it":"Wybierz akcje i wci??nij przycisk by przypisa??.",
            "You cannot choose this action/key more than once!":"Posiadasz ju?? tak?? akcje lub przycisk.",
            "Add shortkey":"Dodaj skr??t",
            "Keyword":"S??owo kluczowe",
            "Version": "Wersja",
            "Apply": "Zatwierd??",
            "You didn't choose any key!": "Nie wybra??e?? ??adnego przycisku!",
            "Restart app to apply language changes.": "Uruchom ponownie aplikacje aby zastosowa?? zmian?? j??zyka."
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: window.localStorage.getItem('language'), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;