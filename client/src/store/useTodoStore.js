import { create } from "zustand";
import toast from "react-hot-toast";
import { getStartDate } from "../../utils/date";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { checkEmailValidity } from "../../utils/checkEmail";

export const useTodoStore = create((set, get) => ({
  todos: [],
  originalTodos: [],
  tags: [""],
  todoDetails: {
    title: "",
    description: "",
    startDate: "",
    deadline: "",
  },
  gettingTodos: false,
  edit: false,

  selectedOption: "",

  todoRecipients: [""],

  allUsers: [],

  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/auth/getallusers");
      console.log(response.data);
      set({ allUsers: response.data.allUsers });
    } catch (e) {
      console.log(e);
    }
  },

  updateTags: async (index, val) => {
    const tempTags = [...get().tags];
    tempTags.splice(index, 1, val.trim());
    console.log(tempTags);
    set({ tags: tempTags });
  },

  addTag: async () => {
    if (get().tags[get().tags.length - 1].trim().length == 0) {
      return toast.error("Provide Tag To Add More");
    }
    set({ tags: [...get().tags, ""] });
  },

  removeTag: async (index) => {
    const tempTags = [...get().tags];
    tempTags.splice(index, 1);
    console.log(tempTags);
    set({ tags: tempTags });
  },

  setTodoDetails: async (obj) => {
    if (new Date(obj?.startDate) < Date.now() - 2 * 60000) {
      return toast.error("Start Date Must Be Valid");
    }
    // console.log(new Date(obj?.deadline) <= new Da)
    if (get().todoDetails.startDate.length == 0 && obj.deadline) {
      toast.error("Provide The Start Date");
    }
    if (
      (obj.deadline && new Date(obj?.deadline) < Date.now()) ||
      new Date(obj?.deadline) <= new Date(get().todoDetails.startDate)
    ) {
      return toast.error("Deadline Must Be Valid");
    }
    set({ todoDetails: { ...get().todoDetails, ...obj } });
    console.log(get().todoDetails);
  },

  setTags: async (tags) => {
    set({ tags: tags });
  },

  setEditTodoDetails: async (obj, tags, edit) => {
    console.log("Edit: ", obj);
    set({ todoDetails: { ...obj }, tags: tags, edit: edit });
  },

  getAllTodos: async () => {
    const { user } = useAuthStore.getState();
    // console.log("User: ", user._id);
    try {
      set({ gettingTodos: true });
      const response = await axiosInstance.get("/todos/gettodos", {
        params: {
          userId: user?._id,
        },
      });
      console.log("Todos: ", response.data.todos);
      set({ todos: response.data.todos, originalTodos: response.data.todos });
    } catch (e) {
      console.log(e);
      // toast.error("Error While Getting Todos");
    } finally {
      set({ gettingTodos: false });
    }
  },

  addTodo: async () => {
    const { todoDetails, tags } = get();
    const tempTodos = [...get().todos];
    const { user } = useAuthStore.getState();
    try {
      const response = await axiosInstance.post("/todos/addtodo", {
        userId: user._id,
        title: todoDetails.title.trim(),
        description: todoDetails.description.trim(),
        startDate: new Date(todoDetails.startDate).toISOString(),
        deadline: new Date(todoDetails.deadline).toISOString(),
        tags: tags,
      });
      console.log(response.data);
      tempTodos.push(response.data.addedTodo);
      set({ todos: tempTodos, originalTodos: tempTodos });
    } catch (e) {
      console.log(e);
    }
  },

  editTodo: async (id) => {
    const { todoDetails } = get();
    if (new Date(todoDetails.startDate) >= new Date(todoDetails.deadline))
      return toast.error("Dates Must Be Valid");
    const tempTodos = [...get().todos];
    try {
      const foundIndex = tempTodos.findIndex((element, index) => {
        return element._id == id;
      });
      const response = await axiosInstance.put("/todos/edittodo", {
        id: id,
        title: todoDetails.title.trim(),
        description: todoDetails.description.trim(),
        startDate: todoDetails.startDate,
        deadline: todoDetails.deadline,
        tags: get().tags,
      });
      console.log(response.data);
      //   tempTodos[foundIndex] = { ...todoDetails, tags: get().tags };
      tempTodos.splice(foundIndex, 1, response.data.updatedTodo);
      set({ todos: tempTodos, originalTodos: tempTodos });
      toast.success("Updated Todo Successfully");
    } catch (e) {
      console.log(e);
    }
  },

  deleteTodo: async (id) => {
    try {
      const tempTodos = [...get().todos];
      const foundIndex = tempTodos.findIndex((todo, index) => todo._id == id);
      const response = await axiosInstance.delete("/todos/deletetodo", {
        params: {
          id: id,
        },
      });
      tempTodos.splice(foundIndex, 1);
      console.log(response.data);
      set({ todos: tempTodos, originalTodos: tempTodos });
    } catch (e) {
      console.log(e);
    }
  },

  changeStatus: async (id) => {
    const tempTodos = [...get().todos];
    try {
      const foundIndex = tempTodos.findIndex((todo, index) => {
        return todo._id == id;
      });
      const status = tempTodos[foundIndex].completed;
      tempTodos[foundIndex].completed = !status;
      // tempTodos.splice(foundIndex, 1);
      // tempTodos.push(tempTodo);
      set({ todos: tempTodos, originalTodos: tempTodos });
      const response = await axiosInstance.put("/todos/changestatus", {
        id: id,
      });
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  },

  addToMyCalendar: async (id) => {
    try {
      const response = await axiosInstance.post("/todos/addtocalendar", {
        id: id,
      });
      console.log(response.data);
      toast.success("Added To Google Calendar");
    } catch (e) {
      console.log(e);
      toast.error("Error While Adding To Google Calendar");
    }
  },

  handleRecipientChange: async (index, val) => {
    const { user } = useAuthStore.getState();
    const tempRecipients = [...get().todoRecipients];
    if (user.email == val.trim() || tempRecipients.includes(val.trim())) {
      tempRecipients[index] = "";
      set({ todoRecipients: tempRecipients });
      return toast.error(
        user.email == val.trim()
          ? "Cannot Share To Yourself"
          : "Duplicate Emails"
      );
    }
    tempRecipients.splice(index, 1, val.trim());
    console.log("TR: ", tempRecipients);
    set({ todoRecipients: tempRecipients });
  },

  addTodoRecipient: async () => {
    const tempRecipients = [...get().todoRecipients];
    if (tempRecipients[tempRecipients.length - 1].trim().length == 0)
      return toast.error("Empty Field");
    if (!checkEmailValidity(tempRecipients[tempRecipients.length - 1]))
      return toast.error("Provide Valid Email");
    tempRecipients.push("");
    set({ todoRecipients: tempRecipients });
  },

  removeTodoRecipient: async (index) => {
    const tempRecipients = [...get().todoRecipients];
    tempRecipients.splice(index, 1);
    set({ todoRecipients: tempRecipients });
  },

  shareTodo: async (id) => {
    const tempRecipients = [...get().todoRecipients];
    const tempTodos = [...get().todos];

    const filteredRecipients = tempRecipients.filter(
      (recipients, index) => recipients.trim() != ""
    );

    if (filteredRecipients.length == 0)
      return toast.error("No One To Share With");

    const foundIndex = tempTodos.findIndex((todo, index) => todo._id == id);

    console.log("Found Shared Todo: ", tempTodos[foundIndex]);

    try {
      const response = await axiosInstance.post("/todos/sharetodo", {
        id: id,
        recipients: filteredRecipients,
      });
      console.log(response.data);
      tempTodos.splice(foundIndex, 1, response.data.sharedTodo);
      set({ todos: tempTodos, originalTodos: tempTodos });
      // return toast.success("Todo Shared Successfully");
      return;
    } catch (e) {
      console.log(e);
      // toast.error(e.response.data.msg);
      throw Error(e);
    }
  },
  searchTodos: async (val) => {
    if (val.trim().length == 0) {
      get().getAllTodos();
    }
    const tempTodos = [...get().originalTodos];
    const filteredTodos = tempTodos.filter((todo, index) => {
      let included = false;
      for (const tag of todo?.tags) {
        included = tag.toLowerCase().startsWith(val.trim().toLowerCase());
      }
      return (
        todo.title.toLowerCase().startsWith(val.trim().toLowerCase()) ||
        todo.title
          .split(" ")[0]
          .toLowerCase()
          .startsWith(val.trim().toLowerCase()) ||
        todo.title.split(" ")[1]?.toLowerCase().startsWith(val.toLowerCase()) ||
        included
      );
    });
    set({ todos: filteredTodos });
    console.log(filteredTodos);
  },

  filterTodos: async (val) => {
    const { getPendingTodos, getCompletedTodos, getDueTodayTodos, getDueTomorrowTodos, getMissedTodos, getAllTodos } = get();
    if(val == 0){
      getAllTodos();
    }
    else if(val == 1){
      getPendingTodos()
    }
    else if(val == 2){
      getCompletedTodos()
    }
    else if(val == 3){
      getDueTodayTodos()
    }
    else if(val == 4){
      getDueTomorrowTodos()
    }
    else if(val == 5){
      getMissedTodos()
    }
  },

  getPendingTodos: async () => {
    const tempTodos = [...get().originalTodos];
    const pendingTodos = tempTodos.filter((todo, element) => {
      return !todo.completed;
    });
    console.log("Pending Todos: ", pendingTodos);
    set({ todos: pendingTodos });
  },

  getCompletedTodos: async () => {
    const tempTodos = [...get().originalTodos];
    const completedTodos = tempTodos.filter((todo, index)=>{
      return todo.completed;
    });

    set({ todos: completedTodos });
  },

  getDueTodayTodos: async () => {
    const tempTodos = [...get().originalTodos];
    
    const dueTodayTodos = tempTodos.filter((todo, index)=>{
      return new Date(todo.deadline)- new Date() < 24 * 60 * 60 * 1000
    });

    set({ todos: dueTodayTodos });
  },

  getDueTomorrowTodos: async () => {
    const tempTodos = [...get().originalTodos];

    const dueTomorrowTodos = tempTodos.filter((todo, index)=>{
      return new Date(todo.deadline) - new Date() >= 24 * 60 * 60 * 1000 && new Date(todo.deadline) - new Date() < 2 * 24 * 60 * 60 * 1000
    });

    set({ todos: dueTomorrowTodos });
  },

  getMissedTodos: async () => {
    const tempTodos = [...get().originalTodos];
    const missedTodos = tempTodos.filter((todo, index)=>{
      return new Date(todo.deadline) - new Date() < 0;
    })

    set({ todos: missedTodos });
  },

  setTodoRecipients: async(val)=>{
    const tempTodoRecipients = [...get().todoRecipients];
    tempTodoRecipients.splice(tempTodoRecipients.length-1, 1, val);
    set({ todoRecipients: tempTodoRecipients });
    get().addTodoRecipient();
  }
}));
