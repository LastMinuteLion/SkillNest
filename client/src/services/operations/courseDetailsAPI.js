import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

const handleApiCall = async (method, url, data, headers) => {
  try {
    const response = await apiConnector(method, url, data, headers);
    if (!response.data.success) {
      throw new Error(response.data.message || "API request failed");
    }
    return response.data;
  } catch (error) {
    console.error(`${url} API ERROR............`, error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  try {
    const data = await handleApiCall("GET", GET_ALL_COURSE_API);
    toast.dismiss(toastId);
    return data.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return [];
  }
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  try {
    const data = await handleApiCall("POST", COURSE_DETAILS_API, { courseId });
    toast.dismiss(toastId);
    return data.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const fetchCourseCategories = async () => {
  const toastId = toast.loading("Loading...");
  try {
    const data = await handleApiCall("GET", COURSE_CATEGORIES_API);
    toast.dismiss(toastId);
    return data.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return [];
  }
};

export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    const response = await handleApiCall("POST", CREATE_COURSE_API, data, headers);
    toast.success("Course Details Added Successfully");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const editCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    const response = await handleApiCall("POST", EDIT_COURSE_API, data, headers);
    toast.success("Course Details Updated Successfully");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const createSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", CREATE_SECTION_API, data, headers);
    toast.success("Course Section Created");
    toast.dismiss(toastId);
    return response.updatedCourse;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", CREATE_SUBSECTION_API, data, headers);
    toast.success("Lecture Added");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const updateSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", UPDATE_SECTION_API, data, headers);
    toast.success("Course Section Updated");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", UPDATE_SUBSECTION_API, data, headers);
    toast.success("Lecture Updated");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", DELETE_SECTION_API, data, headers);
    toast.success("Course Section Deleted");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", DELETE_SUBSECTION_API, data, headers);
    toast.success("Lecture Deleted");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("GET", GET_ALL_INSTRUCTOR_COURSES_API, null, headers);
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return [];
  }
};

export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    await handleApiCall("DELETE", DELETE_COURSE_API, data, headers);
    toast.success("Course Deleted");
    toast.dismiss(toastId);
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
  }
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", GET_FULL_COURSE_DETAILS_AUTHENTICATED, { courseId }, headers);
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return null;
  }
};

export const markLectureAsComplete = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await handleApiCall("POST", LECTURE_COMPLETION_API, data, headers);
    toast.success("Lecture Completed");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return false;
  }
};

export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = { Authorization: `Bearer ${token}` };
    await handleApiCall("POST", CREATE_RATING_API, data, headers);
    toast.success("Rating Created");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    toast.error(error.message);
    toast.dismiss(toastId);
    return false;
  }
};
