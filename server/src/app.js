import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import fileUpload from "express-fileupload"

import { uploadImageToCloudinary } from "./utils/imageUploader";

const app = express();

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
    })
);

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit: "16kb"}));
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

app.use(cookieParser());
app.use(express.static("public"));


app.get("/",(req,res) =>{
    return res.json({
        success:true,
        message:"Your Server is running"
    })
})

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})

