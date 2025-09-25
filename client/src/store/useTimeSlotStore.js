import { create } from "zustand";


export const useTimeSlotStore = create((set, get)=>({
    weekDates: [],
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthDays: [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    getWeekDates: async()=>{

        const tempWeekDates = [];

        const date = new Date();
        let currentDay = date.getDay();
        let currentDate = date.getDate();

        while(currentDay >= 0){
            if(currentDate < 1) currentDate = get().monthDays[new Date().getMonth()-1];
            tempWeekDates.unshift(currentDate);
            currentDate--;
            currentDay--;
        }

        let currentDay2 = date.getDay();
        let currentDate2 = date.getDate();

        while(currentDay2 < 6){
            if(currentDate2 > get().monthDays[new Date().getMonth()]) currentDate2 = 1;
            currentDay2++;
            currentDate2++;
            tempWeekDates.push(currentDate2);
        }
        console.log("Week Days: ", tempWeekDates);

        set({ weekDates: tempWeekDates })
    }
}))