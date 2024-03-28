import { Router } from "express";
import { createRating,
getAllRating,
getAverageRating } from "../controllers/RatingAndReview.controllers";

import { auth, isStudent } from "../middlewares/auth";

const router = Router();

router.route("/createRating").post(auth,isStudent,createRating)
router.route("/getAllRating").get(getAllRating)
router.route("getAverageRating").get(getAverageRating)

export default router;