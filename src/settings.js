// noinspection SpellCheckingInspection
const naverKoreanDict = {
  queryURL:'https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic',
  css:  `<style>
    div.option_area, div#header, div#footer, div#aside, div.component_socialplugin, div.tab_scroll_inner, div.section_suggestion, .section.section_etc{
        display: none !important;
    }

    .section {
        padding-top: 10px !important;
    }
    
    div#container {
        padding: 5px !important;
    }

    div#content {
        padding: 0 !important;
    }

    .component_keyword {
        padding: 10px 10px 30px 15px !important;
    }
    
    div#container, div#content {
        width: auto !important;
    }

    ::-webkit-scrollbar {
      width: 6px !important;
    }
    
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important; 
        border-radius: 10px !important;
    }
    
    ::-webkit-scrollbar-thumb {
        border-radius: 10px !important;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5) !important; 
    }
    </style>
    `
}

const oxfordOnlineDictionary = {
  queryURL: 'https://www.collinsdictionary.com/dictionary/english/<<word>>',
  css: `<style>
  header, div.topslot_container.dictionary_long, div.tabsNavigation, a.share-button.icon-Share, #stickyslot_container {
    display: none !important;
  }
  main {
    padding: 0 !important;
  }
  </style>`
}

const googleTranslateEnglishKorean = {
  queryURL: "https://translate.google.com/?sl=en&tl=ko&text=<<word>>&op=translate",
  css: ``,
}

const dictionaryDotCom = {
  queryURL: "https://www.dictionary.com/browse/<<word>>",
  css: `<style>
  header, section.TeixwVbjB8cchva8bDlg, div.ac-player-ph {
    display: none !important;
  }
  </style>`,
}

const naverEnglishDictionary = {
  queryURL: "https://en.dict.naver.com/#/search?query=<<word>>",
  css:  `<style>
  #header, #aside, div.option_area, #relationSearchArea, div.listen_global_area {
    display: none !important;
  }
  
  #container {
    display: flex !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  #content {
    width: 100% !important;
    padding: 0 !important;
    margin 0 !important;
  }
  </style>
  `
}

const activeDictionary = naverKoreanDict;

module.exports = {
  windowSize: {
    width: 500,
    height: 550,
  },
  queryURL: activeDictionary.queryURL,
  css: activeDictionary.css,
  backgroundColor: "#2e2e36",
  dictionaryHotkey: 'CommandOrControl+D',
};
