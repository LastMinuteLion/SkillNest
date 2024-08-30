import { Profile } from "../models/Profile.models.js";
import { User } from "../models/User.models.js";
import { Course } from "../models/Course.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

// Method for updating a profile
const updateProfile = asyncHandler(async (req, res) => {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const id = req.user.id;

    if (!dateOfBirth || !contactNumber || !id) {
        throw new ApiError(400, "All fields are required");
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
        new ApiResponse(200, profileDetails, "Profile updated successfully")
    );
});

// Method for deleting an account
const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
        throw new ApiError(404, "User not found");
    }

    const profileId = userDetails.additionalDetails;
    await Profile.findByIdAndDelete(profileId);

    for (const courseId of userDetails.courses) {
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    studentsEnrolled: userId,
                },
            },
            { new: true }
        );
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Account deleted successfully")
    );
});

// Method for getting all user details
const getAllUserDetails = asyncHandler(async (req, res) => {
    const id = req.user.id;

    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    return res.status(200).json(
        new ApiResponse(200, userDetails, "User data fetched successfully")
    );
});

// Method for updating the display picture
const updateDisplayPicture = asyncHandler(async (req, res) => {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        {
            image: image.secure_url
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedProfile, "Profile picture updated successfully")
    );
});

// Method for getting enrolled courses
const getEnrolledCourses = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userDetails = await User.findOne({ _id: userId })
        .populate("courses")
        .exec();

    if (!userDetails) {
        throw new ApiError(409, `Could not find user with id ${userId}`);
    }

    return res.status(200).json(
        new ApiResponse(200, userDetails.courses, "Courses fetched successfully")
    );
});

// Method for the instructor dashboard
const instructorDashboard = asyncHandler(async (req, res) => {
    try {
        const instructorId = req.user.id;
        const courseDetails = await Course.find({ instructor: instructorId });

        if (!courseDetails.length) {
            throw new ApiError(404, "No courses found for this instructor");
        }

        const courseData = courseDetails.map(course => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };

            return courseDataWithStats;
        });

        return res.status(200).json(
            new ApiResponse(200, { courses: courseData }, "Instructor dashboard data fetched successfully")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Server Error")
        );
    }
});

export {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
};
