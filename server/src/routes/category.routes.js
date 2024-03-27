import { Router } from "express";
import { createCategory,
    showAllCategory,
    categoryPageDetails } from "../controllers/Category.controllers";

import { isAdmin,auth } from "../middlewares/auth";

const router = Router();

router.route("/createCategory").post(auth,isAdmin,createCategory);
router.route("/showAllCategories").get(showAllCategory)
router.route("/getCategoryDetails").post(categoryPageDetails)

export default router;