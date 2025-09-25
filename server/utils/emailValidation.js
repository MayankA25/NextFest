import dns, { resolveMx } from "dns";


export const checkMxRecords = async (email)=>{
    return new Promise((resolve)=>{
        dns.resolveMx(email.split("@")[1], (err, addresses)=>{
            if(err || !addresses || addresses.length === 0){
                console.log("No");
                resolve(false);
            }
            else{
                console.log("Yes");
                resolve(true);
            }
        })
    })
}