import { Tag } from "../models/Tags.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

//create TAG handler function

const createTag = asyncHandler(async(req,res) => {
    const {name , description} = req.body;

    if(!name || !description){
        throw new ApiError(400 , "All fields are required")
    }

    //create entry in DB

    const tagDetails = await Tag.create({
        name:name,
        description:description,
    })
    console.log(tagDetails);

    return res.status(200).json(
        new ApiResponse(200 , "Tag created succesfully", {})
    )
})


//get all tags handler function

const showAllTags = asyncHandler( async(req , res) => {
    try {
        const allTags = await Tag.find({} , {name:true , description:true})
        res.status(200).json(
            new ApiResponse(200 , allTags , "All tags returned succesfully")
        )
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})


export{
    createTag,
    showAllTags,
}