const { ipcRenderer} = require('electron')

window.addEventListener("DOMContentLoaded", async () => {
    const css = await ipcRenderer.invoke('get-css')
    document.head.innerHTML += css
})
