import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { mailSender } from "../utils/mailSender";
import bcrypt from 'bcrypt';


const resetPasswordToken = asyncHandler( async(req,res) => {
    //get email from req body
    //check user for the email , email validation
    //generate token
    //update user by adding token and expiration time
    //create url
    //send mail containing the url
    //return response

    try {
        const email = req.body;
    
        const user = await User.findOne({email:email});
    
        if(!user){
            throw new ApiError(400 , "Email not registered with us")
        }
    
        const token = crypto.randomUUID();
    
        const  updatedDetails = await User.findOneAndUpdate(
                {email:email} ,
            {
                token:token,
                resetPasswordExpires:Date.now() + 5*60*1000,
            },
            {new:true});
        
    
        const url = `http://localhost:3000/update-password/${token}`
    
    
        await mailSender(email , "Password Reset Link" , `Password reset Link: ${url}`);
    
        return res.status(200).json({
            success:true,
            message:'Email sent succesfully ,please check mail'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong'
        })
    }
})

const resetPassword = asyncHandler(async(req,res) => {

    const{password , confirmPassword , token} = req.body;

    if(password !== confirmPassword){
        throw new ApiError(402, "password not matching")
    }

    const userDetails = await User.findOne({token:token});

    if(!userDetails){
        throw new ApiError(409 , "Token is Invalid")
    }

    if(userDetails.resetPasswordExpires < Date.now()){
        throw new ApiError(409,"Token is Expired , please regenerate")
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )

    return res.status(200).json({
        success:true,
        message:'Password reset succesfully'
    })
})


export{
    resetPasswordToken,
    resetPassword
}