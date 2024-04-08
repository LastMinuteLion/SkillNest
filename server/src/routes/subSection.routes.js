import { Router } from "express";
import { isInstructor, auth } from "../middlewares/auth.js";
import {
  createSubSection,
  deleteSubSection,
  updateSubSection,
} from "../controllers/SubSection.controllers.js";


const router = Router();

router
  .route("/createSubSection")
  .post(auth, isInstructor, createSubSection);
router
  .route("/updateSubSection")
  .post(auth, isInstructor, updateSubSection);
router
  .route("/deleteSubSection")
  .delete(auth, isInstructor, deleteSubSection);

export default router;