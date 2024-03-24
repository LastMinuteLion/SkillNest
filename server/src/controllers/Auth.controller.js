import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OTP } from "../models/OTP.models.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
//REquire dotenv



// sendOTP

const sendOTP = asyncHandler(async(res,res) => {

    //fetch email from req body

    const {email} = req.body;

    //check if user already exists
    const checkUserPresent = await User.findOne({email});

    //if user already exists return response

    if(checkUserPresent){
        throw new ApiError(409 , "User already exists")
    }

    //generate otp

    var otp = otpGenerator.generate(6 , {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    console.log("OTP generated" , otp);

    //check unique otp or not
    let result = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator(6 ,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        } )
        result = await OTP.findOne({otp:otp});
    }

    const otpPayload = {email , otp};

    //create and entry in DB for OTP

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json(
        new ApiResponse(200 , otp , "OTP sent succesfully")
    )


})

const signUp = asyncHandler( async(req ,res) => {
    //take full details from frontend

    const {email ,
         firstName , lastName , password , 
         confirmPassword ,
         accountType , //acc type is tab , value milegi hi 
         contactNumber , otp} = req.body;

         //validate data 

         if(
            [firstName , lastName , email , password , confirmPassword,
             contactNumber , otp].some((field) => 
             field ?. trim() === "")
         ){
            throw new ApiError(400 , "All fields are required")
         }

         //password match 
         if(password !== confirmPassword){
            throw new ApiError(400 , "Password does not match")
         }

         // check if user exists or not

         const existingUser = await User.findOne({email});
         if(existingUser){
            throw new ApiError(409 , "User already exists")
         }

         //find the most recent OTP in DB stored for user
         const recentOTP = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
         console.log(recentOTP);

         //validate OTP

         if(recentOTP.length == 0){
            //OTP not found
            throw new ApiError(400 , "OTP not found")
         }
         else if(otp !== recentOTP.otp){
            throw new ApiError(400, "OTP not matching")
         }


         //HAsh password

         const hashedPassword = await bcrypt.hash(password ,10);

         //create entry in DB
         //profile for additonal details

         const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
         })
         const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
         })

         return res.status(201).json(
            new ApiResponse(200 , user, "User registered succesfully")
         )
})

const loginUser = asyncHandler( async(req,res) => {
    //get data from req body

    const {email , password}  = req.body;

    //validation of data
    if(!email || !password){
        throw new ApiError(400 , "Username / email required")
    }

    // find if the user is registered or not
    const user = await User.findOne({email}).populate("additionalDetails");
    if(!user){
        throw new ApiError(400 , "User does not exist")
    }

    //generate JWT , after matching password

    if(await bcrypt.compare(password, user.password)){
        const payload = {
            email:user.email,
            id: user._id,
            role:user.accountType,
        }
        const token = jwt.sign(payload , process.env.JWT_SECRET, {
            expiresIn:"2h",
        })

        user.token = token; // might create error check 
        user.password = undefined;

        //create cookie
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token" , token , options).status(200).json({
            success:true,
            token,
            user,
            message:'Logged in succesfully'
        })
    }else{
        throw new ApiError(400 , "Password is incorrect")
    }
   })

   //changePassword

   const changePassword = asyncHandler( async(req,res) => {
    //get data from body

    const{currentPassword , newPassword , confirmNewPassword ,email} = req.body;

    //get old password , new password , confirm newpassword

    if (!currentPassword || !newPassword || !confirmNewPassword || !email) {
        throw new ApiError(400, "Please provide all required fields");
      }

    //validation

    const user = await User.findById({email:email});
    if (!user) {
        throw new ApiError(404, "User not found");
      }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
       throw new ApiError(401, "Incorrect current password");
      }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

     // Update user password in database ,update in db
     user.password = hashedNewPassword;
     await user.save();


    //send mail of password updated



    //return response

    res.status(200).json(
        new ApiResponse(200 , user , "password changed succesfully")
    )
   })




export{
    sendOTP,
    signUp,
    loginUser,
    changePassword,


}
