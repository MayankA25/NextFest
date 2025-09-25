import {google} from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env" })

export const getOAuthClient = async(refreshToken)=>{
    const OAuth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
    ) 

    OAuth2Client.setCredentials({
        refresh_token: refreshToken
    })

    const { accessToken } = OAuth2Client.getAccessToken();

    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    })

    return OAuth2Client;
}