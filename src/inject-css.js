const { contextBridge, ipcRenderer } = require('electron');

const InjectCSS = () => {
  let myiframe = document.getElementById('my-iframe');
  let head = myiframe.contentWindow.document.head;
  head.innerHTML += `<style>
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
        padding: 0px
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
    `;
};

// Inject CSS on DOMContentLoaded of iframe.
const IFrameOnLoad = () => {
  let myiframe = document.getElementById('my-iframe');
  myiframe.contentWindow.addEventListener(
    'DOMContentLoaded',
    (e) => {
      InjectCSS();
    },
    true
  );
};

document.addEventListener('DOMContentLoaded', () => {
  IFrameOnLoad();
});

const changeIframe = (text, url) => {
  console.log(`changing iframe with text: ${text}`);

  const searchBarText = document.getElementById('SearchBarText');
  // searchBarText.value = text;
  searchBarText.value = '';
  searchBarText.focus();

  text = encodeURIComponent(text);
  url = url.replace('<<word>>', text);

  // create new iframe
  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('src', url);
  ifrm.setAttribute('frameborder', '0');
  ifrm.setAttribute('id', 'my-iframe');
  ifrm.setAttribute('scrolling', 'yes');

  // remove existing iframe
  myiframe = document.getElementById('my-iframe');
  myiframe.remove();

  // add new iframe to dom
  const ifrmContainer = document.getElementById('iframe-container');
  ifrmContainer.appendChild(ifrm);
  ifrm.contentWindow.addEventListener(
    'DOMContentLoaded',
    (e) => {
      InjectCSS();
    },
    true
  );
};

ipcRenderer.on('change-iframe', (event, store) => {
  changeIframe(store.text, store.url);
});

ipcRenderer.on('focus-search', (event, store) => {
  const searchBarText = document.getElementById('SearchBarText');
  searchBarText.value = '';
  searchBarText.focus();
});

contextBridge.exposeInMainWorld('api', {
  changeIframe: changeIframe,
});
