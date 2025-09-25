import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config({path: "D:\\Mayank Data\\CODING\\NextFest\\server\\.env"});

let redis;

if(!redis){
    redis = new IORedis(process.env.REDIS_URI, {
        maxRetriesPerRequest: null
    })

    redis.on("connect", ()=>{
        console.log("Connected To Redis");
    });

    redis.on("error", (err)=>{
        console.log("Error While Connecting To Redis: ", err)
    })
}

// console.log("Redis: ", redis);

export const connection = redis;