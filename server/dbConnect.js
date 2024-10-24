const mongoose = require("mongoose")

const connectToDatabase = async () =>{
    try {
        const MONGODB_URL = process.env.MONGODB_URL
        mongoose.connect(MONGODB_URL)
            .then(()=>{
                console.log(`MongoDB connected 👌`);
            })
            .catch((err)=>{
                throw err
            })
    } catch (err) {
        console.log(`🤣 MongoDB connection error : ${err} `);
    }
}


module.exports = connectToDatabase