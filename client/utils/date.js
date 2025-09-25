export const getStartDate = ()=>{
    const now = new Date();

    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString("en-US", {
        hour12: false
    });

    console.log("Current Date: ", currentDate);
    console.log("Current Time: ", currentTime);

    const splittedDate = currentDate.split("/");
    const splittedTime = currentTime.split(":");

    console.log("Splitted Date: ", splittedDate);
    console.log("Splitted Time: ", splittedTime);

    const dateTime = `${splittedDate[2]}-${splittedDate[0].padStart(2, "0")}-${splittedDate[1].padStart(2, "0")}T${splittedTime[0].padStart(2, "0")}:${splittedTime[1].padStart(2, "0")}:00`;

    console.log("Date Time: ", dateTime);

    return dateTime
}


// getStartDate();

export const formatDateTime = (utcString)=>{
    const date = new Date(utcString);

    const dateString = date.toLocaleDateString();
    const timeString = date.toTimeString();

    const splittedDate = dateString.split("/");
    const splittedTime = timeString.split(":");

    console.log("SD: ", splittedDate);
    console.log("ST: ", splittedTime)

    const dateTime = `${splittedDate[2]}-${splittedDate[0].padStart(2, "0")}-${splittedDate[1].padStart(2, "0")}T${splittedTime[0].padStart(2, "0")}:${splittedTime[1].padStart(2, "0")}:00`;

    console.log(dateTime);

    return dateTime;
}

formatDateTime('2025-09-18T12:48:00.000+00:00')