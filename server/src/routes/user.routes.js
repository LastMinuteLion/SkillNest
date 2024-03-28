import { Router } from "express";
import { changePassword,
    loginUser,
    signUp,
sendOTP} from "../controllers/Auth.controller";

import { resetPassword ,resetPasswordToken } from "../controllers/ResetPassword.controller";
import { auth } from "../middlewares/auth";
const router = Router();

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


router.route("/signup").post(signUp)
router.route("/login").post(loginUser)
router.route("/sendotp").post(sendOTP)
router.route("/changePassword").post(auth ,changePassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

router.route("/reset-password-token").post (resetPasswordToken)
router.route("/reset-password" ).post(resetPassword)

export default router;