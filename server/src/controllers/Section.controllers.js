import { Section } from "../models/Section.models";
import { Course } from "../models/Course.models";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createSection = asyncHandler(async(req,res) => {
    const {sectionName , courseId} = req.body;

    if(!sectionName || !courseId){
        throw new ApiError(400 , "All fields are required");
    }

    const newSection = await Section.create({sectionName});

    const updatedCourseDetails = await Course.findByIdAndUpdate(courseId ,
        {
            $push:{
                courseContent:newSection._id,
            }
        },{
            new:true
        }).
           populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
           }) .exec();

    return res.status(200).json(
        new ApiResponse(200 ,updatedCourseDetails, "Section Created Succesfully")
    )
})

const updateSection = asyncHandler( async(req,res) =>{
    const {sectionName , sectionId} = req.body;

    if(!sectionName || !sectionId){
        throw new ApiError(400 , "All fields are required");
    }

    //update data

    const sectionUpdate = await Section.findByIdAndUpdate(sectionId, {sectionName},
        {new:true})

    if(!sectionUpdate){
        throw new ApiError(500 , "Section updation Failed")
    }

    return res.status(200).json(
        new ApiResponse(200,{} , "Section Updated Succesfully")
    )
    
})


const deleteSection = asyncHandler(async(req,res) =>{
    const {sectionId } = req.params

    await Section.findOneAndDelete(sectionId);

    return res.status(200).json(
        new ApiResponse(200 , {} , "Section Deleted Succesfully")
    )
    //do we need to delete section from course schema
})

export{
    createSection,
    updateSection,
    deleteSection,
}