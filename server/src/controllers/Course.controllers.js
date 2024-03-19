import { Course } from "../models/Course.models";
import { Tag } from "../models/Tags.models";
import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadImageToCloudinary } from "../utils/imageUploader";

//create course handler function

const createCourse = asyncHandler(async(req,res) => {
    const{courseName , courseDescription , whatYouWillLearn ,price , tag} = req.body;

    //get thmubnail
    const thumbnail = req.files.thumbnailImage;

    //validation 
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag
        || !thumbnail){
            throw new ApiError(400 , "All fields are required")
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details: " , instructorDetails);

    if(!instructorDetails) {
        throw new ApiError(404 , " Instructor details not found")
    }

    //check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if(!tagDetails){
        throw new ApiError(404 , " Tag details not found")
    }

    //upload Image to CLoduinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);


    //create an entry in db
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url,
    })

    //add the new course to the user schema of Instructor
    await User.findByIdAndUpdate(
        {_id:instructorDetails._id},
        {
            $push:{
                courses:newCourse._id,
            }
        },
        {new:true},
    )

    //update tag schema

    await Tag.findByIdAndUpdate(
        {id:tagDetails._id},
        {
            $push:{
                courses:newCourse._id,
            }
        },
        {new:true}
    )

    return res.status(200).json({
        success:true,
        message:"Course Created Succesfully",
        data:newCourse
    }
    )
})



//getALlCourses  handler function

const showAllCourses = asyncHandler( async(req,res) =>{
    const allCourses = await Course.find({} , {courseName:true,
                                              price:true,
                                              thumbnail:true,
                                            instructor:true,
                                            ratingAndReviews:true,
                                            studentsEnrolled:true,})
                                            .populate("instructor")
                                            .exec();
    
    return res.status(200).json(
        new ApiResponse(200 , allCourses , "Succesfully fetched courses")
    )
})

export{
    createCourse,
    
}
