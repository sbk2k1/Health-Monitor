const schedule = require('node-schedule');
const sql = require('mssql');
const { ConnectionSql } = require('../models/Connection');

schedule.scheduleJob('*/10 * * * * *', async () => {
  try {
    const connections = await ConnectionSql.find({});
    
    connections.forEach(async connection => {
      try {
        const pool = await sql.connect({
          server: connection.host,
          port: connection.port,
          user: connection.user,
          password: connection.password,
          database: connection.database
        });

        console.log(connection.query);



        const result = await pool.request().query(connection.query);

        connection.status = 'Connected';
        connection.statusCode = 'Success';
        connection.responseSize = result.rowsAffected.toString();
        connection.lastChecked = new Date().toISOString();

        await connection.save();

        sql.close();
      } catch (error) {
        console.log(error.message);

        connection.status = 'Error';
        connection.statusCode = 'Error';
        connection.responseSize = 'Error';
        connection.lastChecked = new Date().toISOString();

        await connection.save();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});
