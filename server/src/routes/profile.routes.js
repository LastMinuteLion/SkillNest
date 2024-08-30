import { Router } from "express";

import { deleteAccount,
getAllUserDetails,
updateDisplayPicture,
getEnrolledCourses,
updateProfile ,instructorDashboard} from "../controllers/Profile.controllers.js";

import { auth, isInstructor } from "../middlewares/auth.js";

const router = Router();

router.route("/updateProfile").put(auth,updateProfile)
router.route("/getUserDetails").get(auth , getAllUserDetails)
router.route("/updateDisplayPicture").put(auth , updateDisplayPicture)
router.route("/getEnrolledCourses").get(auth , getEnrolledCourses)
router.route("/deleteProfile").delete(auth,deleteAccount)
router.route("/instructorDashboard").get(auth , isInstructor, instructorDashboard)

export default router;