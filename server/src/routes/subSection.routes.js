import { Router } from "express";
import { isInstructor, auth } from "../middlewares/auth.middleware.js";
import {
  createSubSection,
  deleteSubSection,
  updateSubSection,
} from "../controllers/subSection.controller.js";


const router = Router();

router
  .route("/createSubSection")
  .post(auth, isInstructor, createSubSection);
router
  .route("/updateSubSection")
  .put(auth, isInstructor, updateSubSection);
router
  .route("/deleteSubSection")
  .delete(auth, isInstructor, deleteSubSection);

export default router;