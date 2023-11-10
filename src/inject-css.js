const { contextBridge, ipcRenderer } = require('electron');

const InjectCSS = () => {
  let iframe = document.getElementById('my-iframe');
  let head = iframe.contentWindow.document.head;
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
    `;
};

// Inject CSS on DOMContentLoaded of iframe.
const IFrameOnLoad = () => {
  let iframe = document.getElementById('my-iframe');
  iframe.contentWindow.addEventListener(
    'DOMContentLoaded',
    () => {
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
  const new_iframe = document.createElement('iframe');
  new_iframe.setAttribute('src', url);
  new_iframe.setAttribute('id', 'my-iframe');

  // remove existing iframe
  const old_iframe = document.getElementById('my-iframe');
  old_iframe.remove();

  // add new iframe to dom
  const iframeContainer = document.getElementById('iframe-container');
  iframeContainer.appendChild(new_iframe);
  new_iframe.contentWindow.addEventListener(
    'DOMContentLoaded',
    () => {
      InjectCSS();
    },
    true
  );
};

ipcRenderer.on('change-iframe', (event, store) => {
  changeIframe(store.text, store.url);
});

ipcRenderer.on('focus-search', () => {
  const searchBarText = document.getElementById('SearchBarText');
  searchBarText.value = '';
  searchBarText.focus();
});

contextBridge.exposeInMainWorld('api', {
  changeIframe: changeIframe,
});
