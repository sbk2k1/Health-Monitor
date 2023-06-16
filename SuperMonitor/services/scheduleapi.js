const axios = require('axios');
const schedule = require('node-schedule');
const { ConnectionApi } = require('../models/Connection');

axios.interceptors.request.use(x => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {}
    x.meta.connectionStartedAt = new Date().getTime();
    return x;
})

schedule.scheduleJob('*/10 * * * * *', async () => {

    // send connection to each connection

    const connections = await ConnectionApi.find({});

    connections.forEach(async connection => {
        try {
            const response = await axios({
                method: connection.connectionType,
                url: connection.url,
            });

            const responseTime = new Date().getTime() - response.config.meta.connectionStartedAt;

            if (responseTime > connection.threshold) {
                connection.status = 'Slow';
            } else {
                connection.status = 'Up';
            }

            var time;


            // check if connection.time.split(',').length is equal to 10
            if (connection.times == undefined) {
                time = responseTime;
            }
            // when there is not , in the times
            else if (connection.times.split(',').length < 10) {
                // add error to the end of the array
                time = connection.times + ',' + responseTime;
            }
            // when there is , in the times
            else {
                // if equal to 10, remove the first element of the array and add the new response time to the end of the array
                const times = connection.times.split(',');
                times.shift();
                times.push(responseTime);
                time = times.join(',');
            }

            connection.times = time;

            connection.statusCode = response.status;
            connection.responseSize = (response.data == undefined) ? 0 : response.data.length;
            connection.lastChecked = new Date().toISOString();

            await connection.save();

        } catch (error) {
            console.log(error.message);
            connection.status = 'Down';
            var time;
            if (connection.times == undefined) {
                time = "error";
            }
            // when there is not , in the times
            else if (connection.times.split(',').length < 10) {
                // add error to the end of the array
                // console.log(connection.times);
                time = connection.times + ',' + "error";
                // console.log(time);
            }
            // when there is , in the times
            else {
                // if equal to 10, remove the first element of the array and add the new response time to the end of the array
                const times = connection.times.split(',');
                times.shift();
                times.push("error");
                time = times.join(',');
            }

            // console.log(time);
            connection.times = time;

            connection.statusCode = "Error";
            connection.responseSize = "Error";
            connection.lastChecked = new Date().toISOString();

            await connection.save();
        }
    });
});

