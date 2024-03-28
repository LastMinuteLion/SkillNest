import { Router } from "express";
import { isInstructor,auth } from "../middlewares/auth";
import { createSection,
updateSection,
deleteSection } from "../controllers/Section.controllers";

const router = Router();

router.route("/createSection").post(auth, isInstructor, createSection);
router.route("/updateSection").put(auth, isInstructor, updateSection);
router.route("/deleteSection").delete(auth, isInstructor, deleteSection);

export default router;