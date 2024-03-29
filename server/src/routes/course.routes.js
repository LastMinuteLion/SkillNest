import { Router } from "express";
import { isInstructor,auth } from "../middlewares/auth.js";

import { createCourse,
getCourseDetails,
showAllCourses } from "../controllers/Course.controllers.js";

const router = Router();

router.route("/createCourse").post(auth,isInstructor,createCourse)
router.route("/getCourseDetails").post(getCourseDetails)
router.route("/getAllCourses").get(showAllCourses)

export default router;
