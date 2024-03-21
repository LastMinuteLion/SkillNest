import { Category } from "../models/Category.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

//create category handler function

const createCategory = asyncHandler(async(req,res) => {
    const {name , description} = req.body;

    if(!name || !description){
        throw new ApiError(400 , "All fields are required")
    }

    //create entry in DB

    const categoryDetails = await Category.create({
        name:name,
        description:description,
    })
    console.log(categoryDetails);

    return res.status(200).json(
        new ApiResponse(200 , {} ,"Category created succesfully")
    )
})


//get all category handler function

const showAllCategory = asyncHandler( async(req , res) => {
    try {
        const categories = await Category.find({} , {name:true , description:true})

        if(!categories){
            throw new ApiError(500 , "Unable to get Categories")
        }
        return res.status(200).json(
            new ApiResponse(200 , categories , "All category returned succesfully")
        )
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})


export{
    createCategory,
    showAllCategory,
}