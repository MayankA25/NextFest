import React, { useEffect } from "react";
import Accordion from "../TodoAccordion/TodoAccordion";
import { Clock, Loader2, Plus, Timer } from "lucide-react";
import AddTodoModal from "../AddTodoModal/AddTodoModal";
import { useTodoStore } from "../../store/useTodoStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getStartDate } from "../../../utils/date";
import TimeSlotModal from "../TimeSlotModal/TimeSlotModal";

export default function TodoContainer() {
  const { gettingUser } = useAuthStore();
  const {
    todos,
    getAllTodos,
    setTodoDetails,
    setEditTodoDetails,
    gettingTodos,
    edit,
    setTags,
    getPendingTodos,
    getCompletedTodos,
    getDueTodayTodos,
    getDueTomorrowTodos,
    getMissedTodos,
    filterTodos,
  } = useTodoStore();
  useEffect(() => {
    getAllTodos();
  }, [gettingUser]);
  return (
    <div className="flex flex-col justify-center gap-10">
      <div className="flex items-between justify-between">
        <h1 className="text-3xl">Your Todos</h1>
          <TimeSlotModal/>
        <div className="flex items-center gap-2 bg-[#222] px-3 py-2 rounded-lg hover:bg-[#333] cursor-pointer transition-all duration-200" onClick={()=>document.getElementById("my_timeslot_modal").showModal()}>
          <Timer className="size-5"/>
          <h1>Time Slots</h1>
        </div>
        <div className="flex items-center justify-center gap-5">
          <select
            defaultValue={0}
            className="select bg-[#222] hover:bg-[#333]"
            onClick={(e) => {
              console.log(e.target.value);
              filterTodos(e.target.value);
            }}
          >
            <option value={0}>All Todos</option>
            <option value={1}>Pending Todos</option>
            <option value={2}>Completed Todos</option>
            <option value={3}>Due Today</option>
            <option value={4}>Due Tomorrow</option>
            {/* <option>Due Day After Tomorrow</option> */}
            <option value={5}>Missed Todos</option>
          </select>
          <AddTodoModal />
          <div className="flex items-center justify-center gap-4">
            <button
              className="btn bg-[#222] hover:bg-[#333] rounded-lg"
              onMouseOver={() => {
                setEditTodoDetails(
                  {
                    title: "",
                    description: "",
                    startDate: getStartDate(),
                    deadline: "",
                    id: undefined,
                  },
                  [""],
                  false
                );
                setTags([""]);
              }}
              onClick={() =>
                document.getElementById("add_todo_modal").showModal()
              }
            >
              <Plus /> Add
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-1.5">
        {gettingTodos || (gettingUser && <Loader2 className="animate-spin" />)}
        {!gettingTodos && todos.length == 0 ? (
          <h1 className="text-lg text-center">No Todos To Display</h1>
        ) : (
          todos.map((todo, index) => {
            console.log("Todo: ", todo);
            return <Accordion key={index} todo={todo} index={index} />;
          })
        )}
      </div>
    </div>
  );
}
