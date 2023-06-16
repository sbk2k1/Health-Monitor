const mongoose = require('mongoose');

// connect mongodb 

const connect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/monitor", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

module.exports = connect();