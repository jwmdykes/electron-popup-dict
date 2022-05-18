const { PythonShell } = require('python-shell')
const path = require('path')
let pyshell = new PythonShell(path.join(__dirname, 'py/pyshell.py'));

const getMousePos = (callback) => {
    pyshell.send('getMousePos')

    pyshell.on('message', (message) => {
        callback(JSON.parse(message))
    })
}

const getText = (callback) => {
    pyshell.send('getText')
    console.log("GOIN")

    pyshell.on('message', (message => {
        callback(JSON.parse(message))
    }))
}

module.exports = {
    getMousePos: getMousePos,
    getText: getText
}