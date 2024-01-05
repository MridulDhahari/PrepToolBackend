const mongoose = require('mongoose')
const config = require('config')

const db = config.get('MongoURI')
// console.log(" db is:",db);
const connectDB = async() =>{
    try{
        await mongoose.connect(db,{
            useNewURLParser : true,
        })
        console.log(`MongoDB is connected .....`)

    }catch(err){
        console.log("Could not connect")
        console.log(`error is: ${err}`)
        process.exit(1);
    }
}
module.exports = connectDB;