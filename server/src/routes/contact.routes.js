import { Router } from "express";
const router = Router()

import { contactUsController } from "../controllers/Contact.controller.js";

router.route("/contact" , contactUsController)

export default router