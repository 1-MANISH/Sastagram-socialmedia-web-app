const mongoose = require("mongoose")

const connectToDatabase = async () =>{
    try {
        const MONGODB_URL = process.env.MONGODB_URL
        mongoose.connect(MONGODB_URL,{dbName:"sastagram"})
            .then((connection)=>{
                console.log(`MongoDB connected 👌 : ${connection.connection.host}`);
            })
            .catch((err)=>{
                throw err
            })
    } catch (err) {
        console.log(`🤣 MongoDB connection error : ${err} `);
    }
}


module.exports = connectToDatabase