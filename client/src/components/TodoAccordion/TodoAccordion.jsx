import React, { useEffect, useRef, useState } from "react";
import { useTodoStore } from "../../store/useTodoStore";
import { formatDateTime } from "../../../utils/date";
import gsap from "gsap";
import { useAuthStore } from "../../store/useAuthStore";
import { Forward } from "lucide-react";
import ShareTodoModal from "../ShareTodoModal/ShareTodoModal";

export default function TodoAccordion({ todo, index }) {
  console.log("Accordion Todo: ", todo);
  const {
    setEditTodoDetails,
    todos,
    deleteTodo,
    changeStatus,
    addToMyCalendar,
  } = useTodoStore();
  const { user } = useAuthStore();
  const ref = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [move, setMove] = useState(false);

  const handleChangeStatus = async (id, width) => {
    setClicked(true);
    changeStatus(id);
    gsap.to(ref.current, {
      width: todos[index].sharedTo.includes(user.email)
        ? `${68 * width}%`
        : `${90 * width}%`,
      duration: 0.5,
    });

    console.log(ref.current.classList);
    // setTimeout(()=>{
    //   ref.current.classList.remove(`w-${width == 0 ? "0" : "full"}`);
    //   ref.current.classList.add(`w-${width == 0 ? "full" : "0"}`)
    // }, 500)
  };

  useEffect(()=>{
    console.log("Move: ", move);
  }, [move])

  return (
    <div className="collapse bg-[#222] border border-base-300 py-2 px-2 text-lg rounded-2xl overflow-visible" onMouseOver={()=>{console.log("Clicked"); setMove(true)}} onMouseOut={()=>setMove(false)}>
      <ShareTodoModal id={todo._id} />
      <input type="radio" name="my-accordion-2" />
      <div className="flex items-center justify-center collapse-title font-semibold text-xl relative" >
        <div className="grid grid-cols-3 place-content-center  place-items-center w-full">
          <h1 className={`relative w-full transition-all duration-200 transform ${move ? "-translate-x-0" : "translate-x-3"}`}>{todo.title}</h1>
          {
            <div
              ref={ref}
              className={`absolute left-0 top-[50%] ${
                !clicked && todo.completed
                  ? todos[index].sharedTo.includes(user.email)
                    ? "w-[68%]"
                    : "w-[90%]"
                  : "w-0"
              } h-1 bg-white/70 rounded-full`}
            ></div>
          }
          <div className="text-sm">
            <span>{new Date(todos[index].deadline).toDateString()}</span>
          </div>
          <div className="flex items-center justify-end w-full">

          {user._id == todos[index].userId._id ? (
            <div
            className={` bg-white/10 p-1.5 rounded-lg hover:bg-white/20 transition-all duration-200 cursor-pointer z-30 flex items-center justify-center w-9 ${!move && "-translate-x-3"}`}
            onClick={() =>
              document.getElementById(`my_shared_todo_modal_${todo._id}`).showModal()
            }
            >
              <Forward className="size-5" />
            </div>
          ) : (
            <div className="text-sm flex items-center justify-end">
              <h1>Shared By: {todos[index].userId.email}</h1>
            </div>
          )}
          </div>
        </div>
      </div>
      <div className="collapse-content text-sm">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2 text-md">
            <li className="flex items-center gap-2">
              Description:{" "}
              <span className="font-semibold">{todo.description}</span>
            </li>
            <li className="flex items-center gap-2">
              Start Date:{" "}
              <span className="font-semibold">
                {new Date(todo.startDate).toDateString()},{" "}
                {new Date(todo.startDate).toLocaleTimeString()}
              </span>
            </li>
            <li>
              Deadline:{" "}
              <span className="font-semibold">
                {new Date(todo.deadline).toDateString()},{" "}
                {new Date(todo.deadline).toLocaleTimeString()}
              </span>
            </li>
            {todos[index].sharedTo.includes(user.email) && (
              <li className="flex items-center gap-3">
                Shared By:{" "}
                <span className="font-semibold flex items-center gap-1.5">
                  {(todos[index].userId.profilePic || todos[index].userId.googleDetails.profilePic) && (
                    <img
                      src={`${todos[index].userId.profilePic || todos[index].userId.googleDetails.profilePic}`}
                      className="w-6.5 h-6.5 rounded-full"
                    />
                  )}
                  <span className="bg-[#444] p-1 px-2.5 rounded-full">
                    {todos[index].userId.email}
                  </span>
                </span>
              </li>
            )}
            {user._id == todos[index].userId._id &&
              todos[index].sharedTo &&
              todos[index]?.sharedTo?.length != 0 && (
                <li className="flex items-center gap-5">
                  Shared To:
                  <div className="flex items-center gap-2.5">
                    {todos[index].sharedTo.map((element, index) => {
                      return (
                        element.length != 0 && (
                          <span
                            key={index}
                            className="bg-[#333] px-3 py-1.5 rounded-full hover:bg-[#444] cursor-default"
                          >
                            {element}
                          </span>
                        )
                      );
                    })}
                  </div>
                </li>
              )}
            {todos[index].tags[0].length != 0 && (
              <li className="flex items-center gap-5">
                Tags:
                <div className="flex items-center gap-2.5">
                  {todos[index].tags.map((element, index) => {
                    return (
                      element.length != 0 && (
                        <span
                          key={index}
                          className="bg-[#333] px-3 py-1.5 rounded-full hover:bg-[#444] cursor-default"
                        >
                          {element}
                        </span>
                      )
                    );
                  })}
                </div>
              </li>
            )}
          </ul>
          <div className="flex flex-col justify-center gap-2">
            <button
              className="btn bg-primary text-white font-bold"
              onClick={() => {
                handleChangeStatus(todo._id, todo.completed ? 0 : 1);
              }}
            >
              {todo.completed ? "Mark As Pending" : "Mark As Complete"}
            </button>
            {user._id == todos[index].userId._id && (
              <button
                className="btn btn-primary text-white font-bold"
                onMouseOver={() => {
                  setEditTodoDetails(
                    {
                      title: todo?.title,
                      description: todo?.description,
                      startDate: formatDateTime(todo?.startDate),
                      deadline: formatDateTime(todo?.deadline),
                      id: todo._id,
                    },
                    todo?.tags,
                    true
                  );
                }}
                onClick={() =>
                  document.getElementById("add_todo_modal").showModal()
                }
              >
                Edit Todo
              </button>
            )}
            {user._id == todos[index].userId._id && (
              <button
                className="btn btn-error text-white font-bold"
                onClick={() => {
                  deleteTodo(todo._id);
                }}
              >
                Delete
              </button>
            )}
            {user._id == todos[index].userId._id && (
              <button
                disabled={!user?.accountLinkedToGoogle}
                className={`btn ${
                  user?.accountLinkedToGoogle
                    ? "bg-primary text-white"
                    : "bg-gray-500 text-gray-400"
                } font-bold`}
                onClick={() => addToMyCalendar(todo._id)}
              >
                {user?.accountLinkedToGoogle
                  ? "Add To My Google Calendar"
                  : "Connect Google Account [Add To Calendar]"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
