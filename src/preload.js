const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('focus-search', () => {
  const searchBarText = document.getElementById('SearchBarText');
  searchBarText.value = '';
  searchBarText.focus();
});


contextBridge.exposeInMainWorld('api', {
  changeWebView: (text) => ipcRenderer.invoke('change-webview', text)
});
