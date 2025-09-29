import React, { useEffect } from "react";
import { useTimeSlotStore } from "../../store/useTimeSlotStore";
import { useTodoStore } from "../../store/useTodoStore";
import { getStartDate } from "../../../utils/date";
import toast from "react-hot-toast";

export default function TimeSlotModal() {
  const { getWeekDates, weekDates, weekDays,  currentMonth, nextMonth, nextMonthIndex } = useTimeSlotStore();

  const { setTodoDetails, setEditTodoDetails, setTags } = useTodoStore();

  useEffect(() => {
    getWeekDates();
  }, []);
  return (
    <dialog id="my_timeslot_modal" className="modal">
      <div className="modal-box bg-[#222] w-11/12 max-w-7xl">
        <h3 className="font-bold text-lg">Select Deadline</h3>
        <div className="flex items-center justify-center my-4 overflow-hidden">
          <div className="h-150 rounded-lg overflow-y-scroll w-full relative">
            <div className="grid grid-cols-7 w-[95%] m-auto rounded-t-2xl bg-[#111] sticky top-0">
              {weekDates.map((date, index) => {
                return (
                  <div key={index} className="py-3 px-4 relative">
                    {new Date().getDate() == date && (
                      <div className="w-[97%] h-0.5 bg-white rounded-3xl absolute top-1 left-0"></div>
                    )}
                    <h1 className={`${new Date().getDate() != date && "text-white/50" } text-3xl`}>{date}</h1>
                    <h1 className={`${new Date().getDate() != date && "text-white/50" }`}>{weekDays[index]}</h1>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 w-[95%] m-auto  rounded-xl gap-1">
              {weekDates.map((date, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center w-full gap-1"
                  >
                    {[...Array(24)].map((time, index2) => {
                      return (
                        <div
                          key={2 * index2 + 1}
                          className="flex flex-col gap-1"
                        >
                          <div
                            key={index2}
                            className="flex items-center justify-center py-6 border border-black/20 rounded-xl bg-[#333] hover:bg-[#444] transition-all duration-200 cursor-pointer"
                            onClick={() => {
                              setTodoDetails({ startDate: getStartDate() });
                              const currentDate = new Date();
                              let currentMonth2 = `${
                                currentDate.getMonth() + 1
                              }`.padStart(2, "0");
                              const newDate = `${date}`.padStart(2, "0");
                              const fullYear = currentDate.getFullYear();
                              const formattedTime = `${`${index2}`.padStart(
                                2,
                                "0"
                              )}:00`;
                              
                              console.log("Current Month: ", currentMonth);
                              console.log("Next Month: ", nextMonth);

                              if(currentMonth != nextMonth && index >= nextMonthIndex){
                                
                                currentMonth2 = `${currentDate.getMonth() + 2}`;
                              }

                              const  formattedDateTime = `${fullYear}-${currentMonth2}-${newDate}T${formattedTime}`;

                              console.log("FDT: ",formattedDateTime)

                              if (new Date(formattedDateTime) < new Date()) {
                                return toast.error("Deadline Must Be Valid!");
                              }

                              setEditTodoDetails(
                                {
                                  title: "",
                                  description: "",
                                  startDate: getStartDate(),
                                  deadline: formattedDateTime,
                                  id: undefined,
                                },
                                [""],
                                false
                              );
                              setTags([""]);

                              document
                                .getElementById("add_todo_modal")
                                .showModal();
                            }}
                          >
                            <div className="flex items-center justify-center cursor-pointer">
                              {`${`${index2}`.padStart(2, "0")}:00`}
                            </div>
                          </div>
                          <div
                            key={2 * index2 + 1}
                            className="flex items-center justify-center py-6 bg-[#333] rounded-xl hover:bg-[#444] transition-all duration-200 cursor-pointer"
                            onClick={() => {
                              const currentDate = new Date();
                              let currentMonth2 = `${
                                currentDate.getMonth() + 1
                              }`.padStart(2, "0");
                              const newDate = `${date}`.padStart(2, "0");
                              const fullYear = currentDate.getFullYear();
                              const formattedTime = `${`${index2}`.padStart(
                                2,
                                "0"
                              )}:30`;

                              if(currentMonth != nextMonth && index >= nextMonthIndex){
                                currentMonth2 = `${currentDate.getMonth() + 2}`;
                              }


                              const formattedDateTime = `${fullYear}-${currentMonth2}-${newDate}T${formattedTime}`;

                              if (new Date(formattedDateTime) < new Date()) {
                                return toast.error("Deadline Must Be Valid!");
                              }

                              setEditTodoDetails(
                                {
                                  title: "",
                                  description: "",
                                  startDate: getStartDate(),
                                  deadline: formattedDateTime,
                                  id: undefined,
                                },
                                [""],
                                false
                              );
                              setTags([""]);

                              document
                                .getElementById("add_todo_modal")
                                .showModal();
                            }}
                          >
                            <div className="flex items-center justify-center cursor-pointer">
                              {`${`${index2}`.padStart(2, "0")}:30`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn bg-[#444] hover:bg-[#333]">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
