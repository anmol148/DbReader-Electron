const {ipcMain,app, BrowserWindow,dialog} = require('electron');
const path = require('path');
const url = require('url');
const Notification = require('electron-notification');
const { executeQuery } = require('./DbConnect.js');
const{Queries}= require('./DbObjects.js');
let webContents;
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule:true,
        contentSecurityPolicy: "default-src 'self'; script-src 'self';",
        preload: `${__dirname}/preload.js`,
     }
    })
    webContents=win.webContents;
    
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
    ipcMain.on('Dashboard-data', (event, data) =>{
      console.log(data['Queryid']);
      executeQuery(data['Queryid'],data).then((result) => {
        if(data['Queryid']=='3'){
          event.sender.send('RecList-result',result);
        }
        else{
          event.sender.send('Dashboard-result',result);
        }
        })
    });
    ipcMain.on('dataFromReact', (event, data) => {
      // Handle the data received from the React component
      console.log(data);
      executeQuery('SELECT Top 1 * FROM Claim',data)
      .then((result) => {
        //console.log(result);
        //win.loadFile(path.join(__dirname, 'success-popup.html'));
  //       dialog.showMessageBox({
  //         type: 'none',
  // title: 'Success',
  // message: 'Operation successful!',
  // buttons: ['OK'],
  // noLink: true,
  // customStyles: {
  //   'messageText': 'success-popup message',
  //   'buttons': 'success-popup buttons'
  // }});
        event.sender.send('query-result',result);
        //win.webContents.send('query-result', result.toString());
      })
      .catch((err) => {
        // Handle the error
        console.error('Error executing query:', err);
      });
      
      //mainWindow.webContents.send('dataToRenderer', data);
    });
    // win.webContents.send('test', 'hello');
    // // Query the database and send the result to the renderer process
    // executeQuery('SELECT Top 10 * FROM Claim')
    //   .then((result) => {
        
    //     win.webContents.send('query-result', result);
    //   })
    //   .catch((err) => {
    //     // Handle the error
    //     console.error('Error executing query:', err);
    //   });
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })