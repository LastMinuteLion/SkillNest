import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";


//authentication

const auth = asyncHandler( async(req, res ,next) => {
    //extract token
    try {
        const token = req.cookies.token || 
        req.body.token ||
         req.header("Authorisation").replace("Bearer" , "");
    
    
        if(!token){
            throw new ApiError(400,"Unauthorised request")
        }
    
        //verify the token
        try {
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
           //verification issue
           
           return res.status(401).json({
            success:false,
            message:'token in invalid',
           });
        }

        next();

    } catch (error) {
        throw new ApiError(401 , error?.message|| "Invalid access Token")
    }

    
})


//is Student

const isStudent = asyncHandler( async(req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified , please try again'
        })
    }
})

const isInstructor = asyncHandler( async(req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified , please try again'
        })
    }
})


const isAdmin = asyncHandler( async(req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified , please try again'
        })
    }
})

export{
    isAdmin,
    isInstructor,
    auth,
    isStudent
}