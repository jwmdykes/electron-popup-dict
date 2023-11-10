const { contextBridge, ipcRenderer } = require('electron');

// Inject CSS on DOMContentLoaded of iframe.
const IFrameOnLoad = () => {
  let iframe = document.getElementById('my-iframe');
  iframe.contentWindow.addEventListener(
      'DOMContentLoaded',
      async () => {
        await injectCSS()
      },
      true
  );
};

document.addEventListener('DOMContentLoaded', () => {
  IFrameOnLoad();
});

const changeIframe = async (text) => {
  let settings = await ipcRenderer.invoke('get-settings')
  let url = settings.queryURL

  const searchBarText = document.getElementById('SearchBarText');
  searchBarText.value = text;
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
      injectCSS();
    },
    true
  );
};

const injectCSS = async () => {
  const settings = await ipcRenderer.invoke('get-settings')
  const css = settings.css

  let iframe = document.getElementById('my-iframe');
  let head = iframe.contentWindow.document.head;
  head.innerHTML += css
};

ipcRenderer.on('focus-search', () => {
  const searchBarText = document.getElementById('SearchBarText');
  searchBarText.value = '';
  searchBarText.focus();
});

ipcRenderer.on('set-settings', (event, store) => {
  console.log("setting settings!")
  console.log(store.electronSettings)
  global.electronSettings = store.electronSettings
})

ipcRenderer.on("change-iframe", async (event, store) => {
  await changeIframe(store.text)
})

ipcRenderer.on('inject-css', (event, store) => {
  injectCSS(store.css)
})


contextBridge.exposeInMainWorld('api', {
  changeIframe: changeIframe,
});
