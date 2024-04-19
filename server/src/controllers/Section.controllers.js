import { Section } from "../models/Section.models.js";
import { Course } from "../models/Course.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SubSection } from "../models/Subsection.models.js";

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
    const {sectionName , sectionId , courseId} = req.body;

    if(!sectionName || !sectionId || !courseId){
        throw new ApiError(400 , "All fields are required");
    }

    //update data

    const sectionUpdate = await Section.findByIdAndUpdate(sectionId, {sectionName},
        {new:true})

    if(!sectionUpdate){
        throw new ApiError(500 , "Section updation Failed")
    }

    const course = await Course.findById(courseId)
    .populate({
        path:"courseContent",
        populate:{
            path:"subSection"
        }
    })
    .exec()

    return res.status(200).json(
        new ApiResponse(200,course , "Section Updated Succesfully")
    )
    
})


const deleteSection = asyncHandler(async(req,res) =>{
    const {sectionId , courseId } = req.body

    await Course.findByIdAndUpdate(courseId,{
        $pull:{
            courseContent: sectionId,
        }
    })

    const section = await Section.findById(sectionId);
    console.log(sectionId , courseId);

    if(!section){
        throw new ApiError(404 , "Section not found")
    }

    await SubSection.deleteMany({_id: {$in: section.subSection}});

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId).populate({
        path:"courseContent",
        populate:{
            path:"subSection"
        }
    })
    .exec();


    return res.status(200).json(
        new ApiResponse(200 , course , "Section Deleted Succesfully")
    )
    //do we need to delete section from course schema -> auto delete
})

export{
    createSection,
    updateSection,
    deleteSection,
}