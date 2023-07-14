// Import the necessary dependencies
const sql = require('mssql');
const {ipcRenderer } = require('electron');
let config;
const{Queries}= require('./DbObjects');
const { queries } = require('@testing-library/react');

// ipcRenderer.on('Sql-Cred',(event,data)=>{
//     console.log(data);
//     config = {
//         server: 'localhost',
//         database: 'RMWIN_new_test',
//         user: data.username,
//         password: data.password,
//         trustServerCertificate: true,
//         options: {
//           encrypt: true, // Use encryption if needed
//         },
//       };
//       connect();
      
// });
// window.electron.receive('Sql-Cred',(event,data)=>{
//     console.log(data);
//     config = {
//         server: 'localhost',
//         database: 'RMWIN_new_test',
//         user: data.username,
//         password: data.password,
//         trustServerCertificate: true,
//         options: {
//           encrypt: true, // Use encryption if needed
//         },
//       };
//       window.electron.send("received",'data received');
//       connect();
      
// });
// Configuration for the MSSQL connection

// let connection;

// async function connect() {
//   try {
//     if (!connection) {
//       connection = await sql.connect(config);
//       alert('Connected to MSSQL');
//     }
//   } catch (err) {
//     alert('Error connecting to MSSQL:', err);
//   }
// }

// async function executeQuery(query) {
//     try {
//       await connect(); // Ensure the connection is established
//       const result = await connection.request().query(query);
//       return result.recordset;
//     } catch (err) {
//       console.error('Error executing query:', err);
//       return null;
//     }
//   }
// Function to execute a SQL query
async function executeQuery(query,data='') {
  try {
    if(query=='1'){
      query=Queries.QueryForDashboard;
    }
    else if(query=='2'){
      query=Queries.QueryForDbList;
    }
     
    // Create a new connection pool
  
    config = {
      server: 'localhost',
      database: 'RMWIN_new_test',
      user: data.username,
      password: data.password,
      trustServerCertificate: true,
      options: {
        encrypt: true, // Use encryption if needed
      },
    };
    await sql.connect(config);
    const request = new sql.Request();
    if(query=='3'){
      query=Queries.fetchRecordlist;
      request.input('database', sql.NVarChar, data.database);
      request.input('dateend', sql.DateTime, data.enddate);
      request.input('datestart', sql.DateTime, data.startdate);
  
      // console.log('type',typeof(query))
      // console.log(query);
      // if(data.database!=''){
      //   query.replace('dbName',data.database);
      // }
      // else{
      //   query.replace('dbName','');
      // }
      
    }
   console.log(query);
    const result = await request.query(query);
    // Execute the query
    //console.log(query);
    //const result = await sql.query(query)
console.log(result);
    // Return the query result
    
    return JSON.stringify(result.recordset);
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

// Export the executeQuery function
module.exports = {
  executeQuery,
};