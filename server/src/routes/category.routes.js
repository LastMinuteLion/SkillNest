import { Router } from "express";
import { createCategory,
    showAllCategory,
    categoryPageDetails } from "../controllers/Category.controllers.js";

import { isAdmin,auth } from "../middlewares/auth.js";

const router = Router();

router.route("/createCategory").post(auth,isAdmin,createCategory);
router.route("/showAllCategories").get(showAllCategory)
router.route("/getCategoryPageDetails").post(categoryPageDetails)

export default router;