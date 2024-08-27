import { Course } from "../models/Course.models.js";
import { Category } from "../models/Category.models.js";
import { Section } from "../models/Section.models.js";
import { SubSection } from "../models/SubSection.models.js";
import { User } from "../models/User.models.js";
import { CourseProgress } from "../models/CourseProgress.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import convertSecondsToDuration from "../utils/secToDuration.js";

// Create Course Handler
const createCourse = asyncHandler(async (req, res) => {
  const { courseName, courseDescription, whatYouWillLearn, price, category, tag: _tag, instructions: _instructions } = req.body;

  // Get thumbnail
  const thumbnail = req.files.thumbnailImage;

  // Validation
  if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !_tag || !_instructions) {
    throw new ApiError(400, "All fields are required");
  }

  // Parse tag and instructions
  const tag = JSON.parse(_tag);
  const instructions = JSON.parse(_instructions);

  // Check if the user is an instructor
  const userId = req.user.id;
  const instructorDetails = await User.findById(userId);
  if (!instructorDetails) {
    throw new ApiError(404, "Instructor details not found");
  }

  // Validate category
  const categoryDetails = await Category.findById(category);
  if (!categoryDetails) {
    throw new ApiError(404, "Category details not found");
  }

  // Upload image to Cloudinary
  const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

  // Create a new course entry
  const newCourse = await Course.create({
    courseName,
    courseDescription,
    instructor: instructorDetails._id,
    whatYouWillLearn,
    price,
    tag,
    category: categoryDetails._id,
    thumbnail: thumbnailImage.secure_url,
    instructions,
    status: req.body.status || "Draft",
  });

  // Add course to user's courses
  await User.findByIdAndUpdate(
    { _id: instructorDetails._id },
    { $push: { courses: newCourse._id } },
    { new: true }
  );

  // Add course to category
  await Category.findByIdAndUpdate(
    { _id: category },
    { $push: { courses: newCourse._id } },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, newCourse, "Course created successfully")
  );
});

// Show All Courses Handler
const showAllCourses = asyncHandler(async (req, res) => {
  const allCourses = await Course.find(
    { status: "Published" },
    {
      courseName: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      studentsEnrolled: true,
    }
  )
    .populate("instructor")
    .exec();

  return res.status(200).json(
    new ApiResponse(200, allCourses, "Successfully fetched courses")
  );
});

// Get Course Details Handler
const getCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const courseDetails = await Course.findOne({ _id: courseId })
    .populate({
      path: "instructor",
      populate: { path: "additionalDetails" },
    })
    .populate("category")
    .populate({
      path: "courseContent",
      populate: { path: "subSection", select: "-videoUrl" },
    })
    .exec();

  if (!courseDetails) {
    throw new ApiError(400, `Could not find the course with ID: ${courseId}`);
  }

  let totalDurationInSeconds = 0;
  courseDetails.courseContent.forEach((content) => {
    content.subSection.forEach((subSection) => {
      totalDurationInSeconds += parseInt(subSection.timeDuration);
    });
  });

  const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

  return res.status(200).json(
    new ApiResponse(200, { courseDetails, totalDuration }, "Course details fetched successfully")
  );
});

// Get Full Course Details Handler
const getFullCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  const courseDetails = await Course.findOne({ _id: courseId })
    .populate({
      path: "instructor",
      populate: { path: "additionalDetails" },
    })
    .populate("category")
    .populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })
    .exec();

  const courseProgressCount = await CourseProgress.findOne({
    courseID: courseId,
    userId: userId,
  });

  if (!courseDetails) {
    throw new ApiError(400, `Could not find the course with ID: ${courseId}`);
  }

  let totalDurationInSeconds = 0;
  courseDetails.courseContent.forEach((content) => {
    content.subSection.forEach((subSection) => {
      totalDurationInSeconds += parseInt(subSection.timeDuration);
    });
  });

  const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

  return res.status(200).json(
    new ApiResponse(200, { courseDetails, totalDuration, completedVideos: courseProgressCount?.completedVideos || [] }, "Full course details fetched successfully")
  );
});

// Get Instructor Courses Handler
const getInstructorCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  const instructorCourses = await Course.find({
    instructor: instructorId,
  }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, instructorCourses, "Successfully retrieved instructor courses")
  );
});

// Delete Course Handler
const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  for (const studentId of course.studentsEnrolled) {
    await User.findByIdAndUpdate(studentId, {
      $pull: { courses: courseId },
    });
  }

  for (const sectionId of course.courseContent) {
    const section = await Section.findById(sectionId);
    if (section) {
      for (const subSectionId of section.subSection) {
        await SubSection.findByIdAndDelete(subSectionId);
      }
    }
    await Section.findByIdAndDelete(sectionId);
  }

  await Course.findByIdAndDelete(courseId);

  return res.status(200).json(
    new ApiResponse(200, null, "Course deleted successfully")
  );
});

export {
  createCourse,
  showAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse,
};
