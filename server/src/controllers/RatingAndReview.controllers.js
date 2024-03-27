import { RatingAndReview } from "../models/RatingAndReview.models.js";
import { Course } from "../models/Course.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createRating = asyncHandler(async(req,res) => {
    const userId = req.user.id;

    const {rating , review , courseId} = req.body;

    const courseDetails = await Course.findOne(
                                {_id:courseId,
                                studentsEnrolled:{$elemMatch:{$eq: userId}},
                            }
    )

    if(!courseDetails){
        throw new ApiError(409, "Student is not enrolled")
    }

    const alreadyReviewed = await RatingAndReview.findOne({
                                        user:userId,
                                        course:courseId,
    });

    if(alreadyReviewed){
        throw new ApiError(403 , "Course is already reviewed")
    }

    const ratingReview = await RatingAndReview.create({
        rating,review,
        course:courseId,
        user:userId
    });

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            $push:{
                ratingAndReviews:ratingReview._id,
            },
        },
        {new :true}
    );

    console.log(updatedCourse);

    return res.status(200).json(
        new ApiResponse(200 , ratingReview,"Rating done succesfully")
    )
})


const getAverageRating= asyncHandler(async(req,res) => {
    
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg: "$rating"},
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        return res.status(200).json({
            success:true,
            message:"Avg ratins is 0",
            averageRating:0
        })
})


const getAllRating = asyncHandler(async(req,res) => {
    const allRatings = await RatingAndReview.find({})
    .sort({rating:"desc"})
    .populate({
        path:"user",
        select:"firstName , lastName email image"
    })
    .populate({
        path:"course",
        select:"courseName",
    })
    .exec();


    return res.status(200).json(
        new ApiResponse(200 , allRatings , "All reviews fetched")
    )
})



export{
createRating,
getAllRating,
getAverageRating
}