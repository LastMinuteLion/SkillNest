import { Router } from "express";
import { isInstructor,auth } from "../middlewares/auth";

import { createCourse,
getCourseDetails,
showAllCourses } from "../controllers/Course.controllers";

const router = Router();

router.route("/createCourse").post(auth,isInstructor,createCourse)
router.route("/getCourseDetails").post(getCourseDetails)
router.route("/showAllCourses").get(showAllCourses)

export default router;
