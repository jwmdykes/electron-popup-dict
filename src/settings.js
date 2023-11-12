// noinspection SpellCheckingInspection
const naverKoreanDict = {
  queryURL:'https://ko.dict.naver.com/search.nhn?query=<<word>>&target=dic',
  css:  `<style>
    div.option_area, div#header, div#footer, div#aside, div.component_socialplugin, div.tab_scroll_inner, div.section_suggestion, .section.section_etc{
        display: none;
    }

    body {
        background-color: #d5eded
    }

    .section {
        padding-top: 10px;
    }
    
    div#container {
        padding: 5px;
    }

    div#content {
        padding: 0;
    }

    .component_keyword {
        padding: 10px 10px 30px 15px
    }
    
    div#container, div#content {
        width: auto;
    }

    ::-webkit-scrollbar {
      width: 6px;
    }
    
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
    }
    </style>
    `
}

const oxfordOnlineDictionary = {
  queryURL: 'https://www.collinsdictionary.com/dictionary/english/<<word>>',
  css: ``
}

const activeDictionary = naverKoreanDict

module.exports = {
  windowSize: {
    width: 500,
    height: 550,
  },
  queryURL: activeDictionary.queryURL,
  css: activeDictionary.css,
  backgroundColor: "#2e2e36",
};
