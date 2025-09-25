import React, { useState } from "react";
import Form from "../../components/Form/Form";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import { useAuthStore } from "../../store/useAuthStore";
import Todos from "../Todos/Todos";
import Account from "../Account/Account";

export default function MainContent() {

  const { user } = useAuthStore();

  return (
    <div className="w-[100vw] m-auto h-full overflow-y-scroll absolute top-0 right-0">
      <Routes>
        <Route path="form" element={!user?.initialFormSubmitted ? <Form /> : <Navigate to={"/main"}/>}></Route>
        <Route index element={user?.initialFormSubmitted ? <Dashboard /> : <Navigate to={"/main/form"}/>}></Route>
        <Route path="todos" element={ <Todos/> }></Route>
        <Route path="account" element={<Account/>} ></Route>
      </Routes>
    </div>
  );
}
