import { Profile } from "../models/Profile.models";
import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Course } from "../models/Course.models";

const createProfile = asyncHandler(async(req,res) => {
    const{dateOfBirth = "" , about = "" , contactNumber ,gender} = req.body;

    const id = req.user.id;

    if(!dateOfBirth || !contactNumber || !id){
        throw new ApiError(400 , "All fields are required")
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json(
        new ApiResponse(200 , profileDetails , "Profile updated Succesfully")
    )
})

const deleteAccount = asyncHandler(async(req,res) =>{
    const userId = req.user.id; // Assuming req.user contains the authenticated user's information

    // Find the user's profile
    const userDetails = await User.findById(userId);
    if (!userDetails) {
        throw new ApiError(404, "User not found");
    }

    // Delete the user's profile
    const profileId = userDetails.additionalDetails;
    await Profile.findByIdAndDelete(profileId);

    //delete from courses and decrease students enrolled

    for (const courseId of userDetails.courses){
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull:{
                    studentsEnrolled: userId ,
                },
            },
            {new:true}
        );
    }

    // Delete the user's account
    await User.findByIdAndDelete(userId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Account deleted successfully")
    );
})

const getAllUserDetails = asyncHandler(async(req,res) =>{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json(
            new ApiResponse(200,userDetails,"User data fetched succesfully")
        )
})

export {
    createProfile,
    deleteAccount,
    getAllUserDetails

}