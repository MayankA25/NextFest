export const generateRandomOTP = ()=>{
    let OTP = Math.floor(100000 + Math.random()*900000);
    console.log(OTP);
    return OTP;
}


// generateRandomOTP();