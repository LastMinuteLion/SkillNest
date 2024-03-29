import { Course } from "../models/Course.models.js";
import { Category } from "../models/Category.models.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

//create course handler function

const createCourse = asyncHandler(async(req,res) => {
    const{courseName , courseDescription , whatYouWillLearn ,price , category} = req.body;

    //get thmubnail
    const thumbnail = req.files.thumbnailImage;

    //validation 
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category
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

    
    

    //upload Image to CLoduinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);


    //create an entry in db
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        category,
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

    //update category schema

   

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

const getCourseDetails = asyncHandler(async(req,res)=>{
    const {courseId} = req.body;

    const courseDetails = await Course.find(
                                            {_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additonalDetails"
                                                    }
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReview")
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .exec();

        if(!courseDetails){
            throw new ApiError(400, `Could not find the course with ${courseId}`)
        }

        return res.status(200).json(
            new ApiResponse(200 , courseDetails , "Course details fetched succesfully")
        )
})

export{
    createCourse,
    showAllCourses,
    getCourseDetails
}
