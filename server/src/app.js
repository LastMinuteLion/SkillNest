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

import userRouter from "./routes/user.routes";
import profileRouter from "./routes/profile.routes.js";
import categoryRouter from "./routes/category.routes.js";
import courseRouter from "./routes/course.routes.js";
import sectionRouter from "./routes/section.routes.js";
import subSectionRouter from "./routes/subSection.routes.js";
import ratingAndReviewRouter from "./routes/ratingAndReview.routes.js";

app.use("/api/v1/users",userRouter)
app.use("/api/v1/profile",profileRouter)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/section",sectionRouter)
app.use("/api/v1/subsection",subSectionRouter)
app.use("/api/v1/ratingAndReview",ratingAndReviewRouter)



// app.get("/",(req,res) =>{
//     return res.json({
//         success:true,
//         message:"Your Server is running"
//     })
// })

// const PORT = process.env.PORT || 8000;


// app.listen(PORT, () => {
//     console.log(`App is running at ${PORT}`);
// })

export {app};
