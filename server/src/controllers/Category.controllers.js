import { Category } from "../models/Category.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/Course.models.js";

function getRandomInt(max){
    return Math.floor(Math.random() * max)
}

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
        const categories = await Category.find({})

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

const  categoryPageDetails = asyncHandler(async(req,res) =>{
    const  {categoryId} = req.body;

    const selectedCategory = await Category.findById(categoryId)
                                        .populate({
                                            path:"courses",
                                            match:{status: "Published"},
                                            populate:"ratingAndReviews",
                                        })
                                        .exec()

    if(!selectedCategory){
        throw new ApiError(404 , "Category not found")
    }

    if(selectedCategory.courses.length === 0){
        console.log("NO courses to display for selected category");
        throw new ApiError(404 , "No courses found for selected category")
    }

    const categoryExceptSelected = await Category.find({
        _id:{$ne:categoryId},
    })

    let differentCategory = await Category.findOne(
        categoryExceptSelected[getRandomInt(categoryExceptSelected.length)]._id
    )
    .populate({
        path:"courses",
        match:{status : "Published"},
    })
    .exec()

    const allCategories = await Category.find()
    .populate({
        path:"courses",
        match : {status : "Published"},
        populate:{
            path:"instructor",
        },
    })
    .exec()

    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
    .sort((a,b) => b.sold - a.sold)
    .slice(0,10)

    
    new ApiResponse(200 , {selectedCategory,differentCategory,mostSellingCourses},"Successfully returned")
})


export{
    createCategory,
    showAllCategory,
    categoryPageDetails,
}