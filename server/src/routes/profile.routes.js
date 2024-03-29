import { Router } from "express";

import { deleteAccount,
getAllUserDetails,
updateDisplayPicture,
getEnrolledCourses,
updateProfile } from "../controllers/Profile.controllers.js";

import { auth } from "../middlewares/auth.js";

const router = Router();

router.route("/updateProfile").put(auth,updateProfile)
router.route("/getUserDetails").get(auth , getAllUserDetails)
router.route("/updateDisplayPicture").put(auth , updateDisplayPicture)
router.route("/getEnrolledCourses").get(auth , getEnrolledCourses)
router.route("/deleteProfile").delete(auth,deleteAccount)

export default router;