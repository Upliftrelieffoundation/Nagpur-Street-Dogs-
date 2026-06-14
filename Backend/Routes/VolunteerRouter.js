import { Router } from "express";
import { createVolunteer } from "../Components/VolunteerController.js";
// import multer from "multer";
// import { Register, Signin } from "../Components/UserComponents.js";

const volunteerRouter = Router();
volunteerRouter.post("/createVolunteer", createVolunteer);
export default volunteerRouter;