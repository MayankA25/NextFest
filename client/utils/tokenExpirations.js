import { jwtDecode } from "jwt-decode";

export const isTokenExpiringSoon = (token) => {
  try {
    const jwtPayload = jwtDecode(token);
    console.log(jwtPayload.exp * 1000);
    // if(jwtPayload.exp - Date.now() <= 6000){
    //     return
    // }

    // console.log("UTC iat:", new Date(jwtPayload.iat * 1000).toISOString());
    // console.log("UTC exp:", new Date(jwtPayload.exp * 1000).toISOString());

    console.log(
      "IST iat:",
      new Date(jwtPayload.iat * 1000).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );
    console.log(
      "IST exp:",
      new Date(jwtPayload.exp * 1000).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    );

    console.log("Payload: ", jwtPayload);

    console.log(jwtPayload.exp * 1000 - Date.now() <= 60000);
    return jwtPayload.exp * 1000 - Date.now() <= 60000;
  } catch (e) {
    return true;
  }
};

// // isTokenExpiringSoon(
// //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGMyOTFiMzJhMjYzMWM4NDVlYmY0ZTMiLCJlbWFpbCI6Im1heWFuay5hMTI1MDUyQGdtYWlsLmNvbSIsImlhdCI6MTc1NzU4MTc0NywiZXhwIjoxNzU3NTgyNjQ3fQ.3TVFUNz1jcCtdXDANRrywhXs5bmLnqUgYBmVmw7bBrg"
// // );
// isTokenExpiringSoon(
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGMyOTVmMGU2ZjQxM2ExMThlYjA2OTQiLCJlbWFpbCI6Im1heWFuay5hMTI1MDUyQGdtYWlsLmNvbSIsImlhdCI6MTc1NzU4MjgzMiwiZXhwIjoxNzU3NTgzNzMyfQ.lLF07KpnsXKV_-CIHndsttoc0mfEkFfWyCrUiTe-RJU"
// );

console.log(Date.now());
