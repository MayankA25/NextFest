import { Todo } from "../models/Todo.js";
import jwt from "jsonwebtoken";
import { createCalendarInvite } from "../utils/googleCalendar.js";
import { checkMxRecords } from "../utils/emailValidation.js";

export const getAllTodos = async (req, res) => {
  const { userId } = req.query;
  console.log("Body: ", req.query);
  console.log("Req: ", req);
  try {
    const allTodos = await Todo.find({ 
      $or: [
        { userId: userId },
        { sharedTo: {$all: [ req.user.email ]} }
      ]
    }).populate("userId");
    console.log("All Todos: ", allTodos);

    const todos = [...allTodos ];

    return res.status(200).json({ todos: todos });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const addTodo = async (req, res) => {
  const { userId, title, description, startDate, deadline, tags } = req.body;
  try {
    console.log(req.body);
    const newTodo = new Todo({
      userId: userId,
      title: title,
      description: description,
      sharedTo: [],
      startDate: startDate,
      deadline: deadline,
      tags: tags,
    });
    const savedTodo = await newTodo.save();
    const foundAddedTodo = await Todo.findById(savedTodo._id).populate('userId');
    return res.status(200).json({ addedTodo: foundAddedTodo });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const editTodo = async (req, res) => {
  const { id, title, descriptiom, startDate, deadline, tags } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: title,
        description: descriptiom,
        startDate: startDate,
        deadline: deadline,
        tags: tags,
      },
      { new: true }
    ).populate('userId');
    return res
      .status(200)
      .json({ msg: "Todo Updated Successfully", updatedTodo: updatedTodo });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.query;
  console.log("id: ", id);
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    console.log("Deleted Todo: ", deletedTodo);
    return res.status(200).json({ msg: "Todo deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const changeStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const foundTodo = await Todo.findById(id);

    let status;

    if (foundTodo.completed) {
      status = false;
    } else {
      status = true;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        completed: status,
      },
      { new: true }
    );

    console.log("Updated Todo: ", updatedTodo);

    return res.status(200).json({ msg: "Todo Completed" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const addToMyGoogleCalendar = async (req, res) => {
  const { id } = req.body;
  try {
    let refreshToken = "";
    let recipients = [];
    const foundTodo = await Todo.findById(id).populate("userId");
    console.log("Found Todo: ", foundTodo);

    refreshToken = foundTodo.userId.googleDetails.refreshToken;
    if (req.session?.passport?.user?.user) {
      // refreshToken = req.session.passport.user.refreshToken
      recipients.push(req.session.passport.user.user.email);
    } else {
      const accessToken = req.cookies.accessToken;
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      recipients.push(decodedToken.email);
    }

    const event = {
      summary: foundTodo.title,
      description: foundTodo.descriptiom,
      start: {
        dateTime: new Date(foundTodo.startDate).toISOString(),
      },
      end: {
        dateTime: new Date(foundTodo.deadline).toISOString(),
      },
      attendees: recipients,
    };

    await createCalendarInvite(refreshToken, event);

    return res.status(200).json({ msg: "Added to google calendar" });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const shareTodo = async (req, res) => {
  const { id, recipients } = req.body;
  try {

    let validDomain = true;

    for(const recipient of recipients){
      const isValid = await checkMxRecords(recipient);
      console.log("MX Records; ", isValid);

      if(!isValid){
        validDomain = false;
        break;
      }
    }
    
    console.log("VD: ", validDomain);

    if(!validDomain){
      return res.status(400).json({ msg: "Provide Valid Domain" });
    }

    const foundTodo = await Todo.findById(id).populate("userId");
    if (!foundTodo) return res.status(400).json({ msg: "Todo Not Found" });
    const refreshToken = foundTodo.userId.googleDetails.refreshToken;

    const event = {
      summary: foundTodo.title,
      description: foundTodo.descriptiom,
      start: {
        dateTime: new Date(foundTodo.startDate).toISOString(),
      },
      end: {
        dateTime: new Date(foundTodo.deadline).toISOString(),
      },
      attendees: recipients,
    };

    await createCalendarInvite(refreshToken, event);

    const prevSharedTo = foundTodo.sharedTo;

    const filteredRecipients = recipients.filter((element, index)=>{
      return !prevSharedTo.includes(element);
    })

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        $push: { sharedTo: { $each: filteredRecipients } },
      },
      { new: true }
    ).populate('userId');

    console.log("Updated Todo: ", updatedTodo);

    return res.status(200).json({ msg: "Todo Shared Successfully", sharedTodo: updatedTodo });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Error While Sharing Todo" });
  }
};
