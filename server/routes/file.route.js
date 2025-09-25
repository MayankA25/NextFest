import { Router } from "express";
import { uploadFile } from "../controllers/file.controller.js";
import { upload } from "../utils/multer.js";

const fileRouter = Router();

fileRouter.post("/upload", upload.array('files'), uploadFile);

export default fileRouter;