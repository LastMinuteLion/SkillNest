import { Router } from "express";
import { createRating,
getAllRating,
getAverageRating } from "../controllers/RatingAndReview.controllers.js";

import { auth, isStudent } from "../middlewares/auth.js";

const router = Router();

router.route("/createRating").post(auth,isStudent,createRating)
router.route("/getReviews").get(getAllRating)
router.route("getAverageRating").get(getAverageRating)

export default router;