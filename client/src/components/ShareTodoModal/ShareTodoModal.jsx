import { Plus, X } from "lucide-react";
import React, { useEffect } from "react";
import { useTodoStore } from "../../store/useTodoStore";
import toast from "react-hot-toast";

export default function ShareTodoModal({ id }) {
  const {
    todoRecipients,
    handleRecipientChange,
    addTodoRecipient,
    removeTodoRecipient,
    shareTodo,
    allUsers,
    getAllUsers,
    setTodoRecipients
  } = useTodoStore();
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <dialog id={`my_shared_todo_modal_${id}`} className="modal">
      <div className="modal-box bg-[#222]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Share Todo</h3>
        {todoRecipients.map((recipient, index) => {
          return (
            <div key={index} className="flex items-center gap-4 my-5">
              <input
                type="email"
                placeholder={`Enter Recipient ${index + 1}`}
                value={todoRecipients[index]}
                onChange={(e) => {
                  handleRecipientChange(index, e.target.value);
                }}
                className="input w-full bg-[#333] focus:outline-0"
              />
              {index == todoRecipients.length - 1 ? (
                <button
                  className="flex items-center justify-center bg-[#333] p-1.5 px-2.5 rounded-lg cursor-pointer hover:bg-[#444] transition-all duration-200 text-sm"
                  onClick={() => addTodoRecipient()}
                >
                  <Plus className="size-5.5" />
                  <p>Add</p>
                </button>
              ) : (
                <button
                  className="flex items-center justify-center bg-[#333] p-2 rounded-lg cursor-pointer hover:bg-[#444] transition-all duration-200"
                  onClick={() => removeTodoRecipient(index)}
                >
                  <X className="size-4.5" />
                </button>
              )}
            </div>
          );
        })}
       {allUsers.length !== 0 && <div className="flex flex-col justify-center bg-[#444] py-2 px-2 rounded-xl">
          {allUsers.map((user, index) => {
            return (
              <div key={index} className="flex items-center gap-2.5 w-full text-sm p-2 py-2 rounded-md hover:bg-[#333] cursor-pointer transition-all duration-200" onClick={()=>{handleRecipientChange(todoRecipients.length-1, user.email)}}>
                <img src={user.profilePic || user.googleDetails.profilePic} className="w-8 h-8 rounded-full object-cover" alt="" />
                <h1>{user.email}</h1>
              </div>
            );
          })}
        </div>}
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn bg-[#333] hover:bg-[#222]"
              onClick={() => {
                toast.promise(async ()=>{

                  await shareTodo(id);
                }, {
                  success: "Todo Shared Successfullu",
                  error: "Error While Sharing Todo",
                  loading: "Sharing"
                })
              }}
            >
              Share
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
