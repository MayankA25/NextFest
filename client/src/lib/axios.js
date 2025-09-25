import axios from "axios";
import { isTokenExpiringSoon } from "../../utils/tokenExpirations";
import { useAuthStore } from "../store/useAuthStore";
// import { useAuthStore } from "../store/useAuthStore";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})

// // const { accessToken } = useAuthStore();
// axiosInstance.interceptors.request.use(async(config)=>{

    
//     if(config.skipAuth) return config;

//     console.log("Request is in the interceptor")

//     // const accessToken = localStorage.getItem("accessToken");

//     if(!accessToken) return config;

//     console.log("Expiring: ", isTokenExpiringSoon(accessToken));

//     if(accessToken && isTokenExpiringSoon(accessToken)){
//         console.log("Trying to refresh token...");
//         const response = await axiosInstance.get("/auth/refresh", { skipAuth: true });
//         console.log("Interceptor Response: ", response.data);
//         const { setAuthenticationManual } = useAuthStore.getState();
//         if(!response.data.authenticated){
//             localStorage.removeItem("accessToken");
//             setAuthenticationManual({ authenticated: false });
//             return config;
//         }
//         localStorage.setItem("accessToken", response.data.accessToken);
//         setAuthenticationManual({ authenticated: true });
//     }
//     console.log("Token: ", accessToken);
//     config.headers.Authorization = `Bearer ${accessToken}`;
//     return config;

// })

axiosInstance.interceptors.response.use((response)=>response, async(error)=>{
    console.log("Inside Response Interceptor...")

    const originalRequest = error.config;


    console.log("Skip Auth: ", originalRequest.skipAuth);

    if(originalRequest?.skipAuth){
        return Promise.reject(error);
    }

    if(error.response?.status == 401 && !originalRequest._retry){
        originalRequest._retry = true;

        try{
            const response = await axiosInstance.get("/auth/refresh", { skipAuth: true });
            console.log(response.data);
            return axiosInstance(originalRequest);
        }catch(refreshError){
            // window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
})