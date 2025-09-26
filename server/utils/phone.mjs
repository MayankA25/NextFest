import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validatePhoneNumber = (phone, defaultCountry = undefined)=>{
    const parsedPhone = parsePhoneNumberFromString(phone, defaultCountry);

    if(!parsedPhone || !parsedPhone.isValid()) return false;

    return true;
}