const dbConfig = require("../config/mongodb.config")
const mongoose = require("mongoose");
const retryInterval = 10000;

const getConnection = () => {
    console.log("Connecting to DB => ", dbConfig.fullUrl);
    mongoose.connect(dbConfig.fullUrl, dbConfig.parameters)
        .then(() => {
            console.log("DB Connection to " + dbConfig.fullUrl + " was established successfully !!!");
            // mongoose.on("error", err => {
            //     ononMongooseError(err);
            // })
        })
        .catch(err => {
            console.log("Failed to connect to DB " + dbConfig + " => ", err);
            setTimeout(getConnection, retryInterval);
        })
}

const ononMongooseError = (err => {
    console.log("Error IN MONGODB => ", err);
})

getConnection();

module.exports = mongoose;