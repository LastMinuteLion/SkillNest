import { Router } from "express";
import { isInstructor,auth } from "../middlewares/auth.js";
import { createSection,
updateSection,
deleteSection } from "../controllers/Section.controllers.js";

const router = Router();

router.route("/addSection").post(auth, isInstructor, createSection);
router.route("/updateSection").put(auth, isInstructor, updateSection);
router.route("/deleteSection").delete(auth, isInstructor, deleteSection);

export default router;