

export const checkEmailValidity = (email)=>{
    return (email.trim().length != 0 && email.split("@").length > 1 && email.split(".com").length > 1)
}


