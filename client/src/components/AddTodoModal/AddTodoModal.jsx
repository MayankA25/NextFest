import React, { useEffect, useState } from "react";
import { Plus, Tags, X } from "lucide-react";
import { useTodoStore } from "../../store/useTodoStore";
import { getStartDate } from "../../../utils/date";
import toast from "react-hot-toast";

export default function AddTodoModal() {
  const {
    tags,
    addTag,
    updateTags,
    todoDetails,
    setTodoDetails,
    addTodo,
    removeTag,
    edit,
    editTodo,
  } = useTodoStore();
  // useEffect(()=>{
  //   setTodoDetails({ startDate: getStartDate });
  // }, [])
  const [close, setClose] = useState(false);
  return (
    <dialog id="add_todo_modal" className="modal">
      <div className="modal-box bg-[#222]">
        <h3 className="font-bold text-xl">{edit ? "Edit Todo" : "Add Todo"}</h3>
        <div className="flex flex-col justify-center py-4 gap-4">
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="title">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={todoDetails.title || ""}
              placeholder="Enter Title"
              className="input bg-[#333] focus:outline-0 w-full"
              onChange={(e) => {
                setTodoDetails({ title: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="title">Description <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={todoDetails.description}
              placeholder="Enter Description"
              className="input bg-[#333] focus:outline-0 w-full"
              onChange={(e) => {
                setTodoDetails({ description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="title">Start Date <span className="text-red-400">*</span></label>
            <input
              type="datetime-local"
              value={todoDetails.startDate}
              className="input bg-[#333] focus:outline-0 w-full"
              onChange={(e) => {
                setTodoDetails({ startDate: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="title">Deadline <span className="text-red-400">*</span></label>
            <input
              type="datetime-local"
              value={todoDetails.deadline || ""}
              className="input bg-[#333] focus:outline-0 w-full"
              onChange={(e) => {
                setTodoDetails({ deadline: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="title">Tags</label>
            <div className="flex flex-col justify-center gap-2">
              {tags.map((tag, index) => {
                return (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      value={tag || ""}
                      type="text"
                      className="input bg-[#333] focus:outline-0"
                      placeholder={`Enter Tag ${index + 1}`}
                      onChange={(e) => updateTags(index, e.target.value)}
                    />
                    {index == tags.length - 1 ? (
                      <button
                        className="flex items-center justify-center bg-[#111] p-2 py-2.5 rounded-lg cursor-pointer hover:bg-[#333]"
                        onClick={() => {
                          addTag();
                        }}
                      >
                        <Plus /> Add Tag
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center bg-[#111] hover:bg-[#333] p-2 py-2.5 cursor-pointer rounded-md"
                        onClick={() => {
                          removeTag(index);
                        }}
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn bg-[#333] rounded-lg" onClick={()=>{setClose(true)}}>Close</button>
            <button
              className="btn bg-[#111] rounded-lg"
              onClick={() => {
                if(todoDetails.title.trim().length == 0 || todoDetails.description.trim().length == 0 || !todoDetails.startDate || !todoDetails.deadline) return toast.error("Provide Required Fields");
                edit ? editTodo(todoDetails.id) : addTodo();
              }}
            >
              {edit ? "Edit" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
