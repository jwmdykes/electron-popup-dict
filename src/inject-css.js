const { ipcRenderer } = require('electron');

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

ipcRenderer.on('change-iframe', (event, store) => {
  text = encodeURIComponent(store.text);
  url = store.url;
  url = url.replace('<<word>>', text);

  // create new iframe
  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('src', url);
  ifrm.setAttribute('frameborder', '0');
  ifrm.setAttribute('id', 'my-iframe');

  // remove existing iframe
  myiframe = document.getElementById('my-iframe');
  myiframe.remove();

  // add new iframe to dom
  document.body.appendChild(ifrm);
  ifrm.contentWindow.addEventListener(
    'DOMContentLoaded',
    (e) => {
      InjectCSS();
    },
    true
  );
});
