const { contextBridge, ipcRenderer } = require('electron');
const { executeQuery } = require('./DbConnect.js');
// Expose the `ipcRenderer` methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  sendsync:(channel,data)=>{
    ipcRenderer.sendSync(channel,data);
  },
  executeQuery
});
