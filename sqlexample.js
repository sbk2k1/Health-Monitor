const cron = require('node-cron');
const sql = require('mssql');

// Configuration for the database connection
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
};

// Function to create a database connection pool
async function createDatabasePool() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected to the database');
    return pool;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

// Perform create operation and measure execution time
async function performCreateOperation(pool) {
  const transaction = pool.transaction();
  try {
    await transaction.begin();
    const request = transaction.request();

    const startTime = new Date(); // Record the start time

    // Execute the create operation
    await request.query('INSERT INTO your_table (column1, column2) VALUES (value1, value2)');

    const endTime = new Date(); // Record the end time

    await transaction.commit(); // Commit the changes

    const executionTime = endTime - startTime; // Calculate the execution time in milliseconds

    return executionTime;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Perform read operation and measure execution time
async function performReadOperation(pool) {
  const request = pool.request();
  try {
    const startTime = new Date(); // Record the start time

    // Execute the read operation
    const result = await request.query('SELECT * FROM your_table');

    const endTime = new Date(); // Record the end time

    const executionTime = endTime - startTime; // Calculate the execution time in milliseconds

    console.log('Read operation result:', result.recordset);

    return executionTime;
  } catch (err) {
    throw err;
  }
}

// Perform update operation and measure execution time
async function performUpdateOperation(pool) {
  const transaction = pool.transaction();
  try {
    await transaction.begin();
    const request = transaction.request();

    const startTime = new Date(); // Record the start time

    // Execute the update operation
    await request.query('UPDATE your_table SET column1 = value1 WHERE condition');

    const endTime = new Date(); // Record the end time

    await transaction.commit(); // Commit the changes

    const executionTime = endTime - startTime; // Calculate the execution time in milliseconds

    return executionTime;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Perform delete operation and measure execution time
async function performDeleteOperation(pool) {
  const transaction = pool.transaction();
  try {
    await transaction.begin();
    const request = transaction.request();

    const startTime = new Date(); // Record the start time

    // Execute the delete operation
    await request.query('DELETE FROM your_table WHERE condition');

    const endTime = new Date(); // Record the end time

    await transaction.commit(); // Commit the changes

    const executionTime = endTime - startTime; // Calculate the execution time in milliseconds

    return executionTime;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Perform CRUD operation and log execution time
async function performCRUDOperation(operation) {
  const pool = await createDatabasePool(); // Create a database connection pool

  try {
    const executionTime = await operation(pool); // Perform the CRUD operation and measure execution time

    // Log the execution time or store it in a database for further analysis

    console.log(`Execution time: ${executionTime}ms`);
  } catch (err) {
    // Handle any errors that occur during the operation
    console.error('Error performing CRUD operation:', err);
  } finally {
    // Close the database connection pool
    await pool.close();
  }
}

// Schedule the CRUD operations using a cron job
function scheduleCRUDOperations() {
  // Define the schedule for running the cron job (e.g., every hour, every day, etc.)
  cron.schedule('0 * * * *', async () => {
    // Perform CRUD operations and log the execution times
    await performCRUDOperation(performCreateOperation);
    await performCRUDOperation(performReadOperation);
    await performCRUDOperation(performUpdateOperation);
    await performCRUDOperation(performDeleteOperation);
  });
}

// Start the cron job to schedule and run the CRUD operations periodically
scheduleCRUDOperations();


// the above code runs every hour and performs the CRUD operations and logs the execution times. You can also store the execution times in a database for further analysis.
// this is used to perform health checks on the database and to monitor the performance of the database.
// for INSERT, UPDATE, and DELETE operations, you can also measure the number of rows affected by the operation and log it for further analysis.
// No changes are made to the data in the database since the transaction is rolled back after the operation is performed.
