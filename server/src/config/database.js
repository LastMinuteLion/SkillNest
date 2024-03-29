import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
});

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n MongoDb connection established! ! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection FAILED", error);
        process.exit(1);
    }
};


export default connectDb;