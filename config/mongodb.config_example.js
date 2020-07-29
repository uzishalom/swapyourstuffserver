// const baseUrl = "mongodb://localhost/";
const username = "";
const password = ""
const dbName = "";
const clusterUrl = ""
const fullUrl = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

const parameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}

module.exports = {
    fullUrl,
    parameters
}