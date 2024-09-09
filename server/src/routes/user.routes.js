import { Router } from "express";
import { changePassword,
    loginUser,
    signUp,
sendOTP} from "../controllers/Auth.controller.js";

import { resetPassword ,resetPasswordToken } from "../controllers/ResetPassword.controller.js";
import { auth } from "../middlewares/auth.js";
const router = Router();

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


router.route("/signup").post(signUp)
router.route("/login").post(loginUser)
router.route("/sendotp").post(sendOTP)
router.route("/changepassword").post(auth ,changePassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

router.route("/reset-password-token").post(resetPasswordToken)
router.route("/reset-password" ).post(resetPassword)

export default router;