import dotenv from "dotenv";
import {app} from "./app.js"
import connectDb from "./config/database.js";

dotenv.config({
    path:"./.env",
})

connectDb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on port:" , process.env.PORT);
    });
})
.catch((err) =>{
    console.log("MongoDB connection failed" , err);
})
