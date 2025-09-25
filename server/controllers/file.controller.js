import path from "path";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";


export const uploadFile = async (req, res)=>{
    try{
        console.log(req.files);

        const urls = await Promise.all(req.files.map(async (file)=>{
            const newPath = `${file.path}${path.extname(file.originalname)}`;
            fs.renameSync(file.path, newPath);
            console.log("New Path: ", newPath);
            const fileName = file.originalname.split(".")[0];
            const publicId = `${fileName}-${Date.now()}`;
            const url = await cloudinary.uploader.upload(newPath, { resource_type: "raw", public_id: publicId });
            fs.unlinkSync(newPath);
            return url.secure_url;
        }))

        console.log("URLs: ", urls);
        
        return res.status(200).json({ msg: "Files Uploaded", urls: urls });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Sevrer Error" });
    }
}