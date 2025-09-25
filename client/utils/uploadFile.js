import { axiosInstance } from "../src/lib/axios"

export const uploadFiles = async(formData)=>{
    try{
        const response = await axiosInstance.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Upload File Response: ", response.data);
        return response.data.urls;
    }catch(e){
        console.log(e);
    }
}