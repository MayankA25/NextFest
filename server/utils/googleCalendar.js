import { google } from "googleapis"
import { getOAuthClient } from "./googleToken.js"

export const createCalendarInvite = async (refreshTokenn, event)=>{
    const auth = await getOAuthClient(refreshTokenn);
    const calendar = google.calendar({ version: "v3", auth: auth });

    await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        sendUpdates: "all"
    })

    console.log("Added In Google Calendar");
}