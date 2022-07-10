require ('dotenv').config
const mongoose = require ('mongoose');
const connectionString = process.env.MONGODB_URL_LOCAL

module.exports= function(){
    mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
}).then(()=> console.log(`CONNECTED TO DB`))
.catch((err)=>console.log(`DATABASE CONNECTION FAILED`))
}