import mongoose from "mongoose";
require("dotenv").config();

const connectDb = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`)
        console.log(`\n MongoDb connection established! ! DB HOST :
        ${connectionInstance.connection.host}`);
    }catch(error){
     console.log("MongoDb connection FAILED", error);
     process.exit(1);
    }
};

export default connectDb;