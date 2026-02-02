"use client";

import { useEffect, useState } from "react";
import "./dashboard.css";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { apiGetAllUser, apiUserIsBannedUpdate } from "../services/authapi";
import { apiGetQuestions, apiQuestionIsBlockedUpdate } from "../services/questinsApi";

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "questions">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [question, setQuestions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

 

  async function loadUsers() {
  const data: any[] = await apiGetAllUser(); 
  setUsers(data)
}

  async function loadQuestions() {
  const data: any[] = await apiGetQuestions(); 
  setQuestions(data)
  
}
useEffect(() => {
    loadData();
  }, [tab]);

async function loadData() {
    try {
      if (tab === "users") {
        const data = await apiGetAllUser();
        setUsers(data);
      }
      if (tab === "questions") {
        const data = await apiGetQuestions();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleBlockQuestion = async (id: string, isBlocked:boolean) => {
    const isBlockeddata={
        isBlocked:!isBlocked
    }
    await apiQuestionIsBlockedUpdate(id, isBlockeddata);
    loadData();
  };

  const handleBannedUser = async (id: string, isBanned: boolean) => {
    const banneddata = {
        isBanned:!isBanned
    }
    await apiUserIsBannedUpdate(id,banneddata);
    loadData();
  };

    const handleLogout = () => {
    dispatch(logout())
          router.push("/auth/login")
        }

        return (
  <div className="admin-container">

    <div className="admin-header">
      <h2>Welcome Admin</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>

    <div className="admin-tabs">
      <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
        Users
      </button>
      <button className={tab === "questions" ? "active" : ""} onClick={() => setTab("questions")}>
        Questions
      </button>
    </div>

    {tab === "users" && (
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className={u.isBanned ? "unblock-btn" : "block-btn"}
                    onClick={() => handleBannedUser(u.id, u.isBanned)}
                  >
                    {u.isBanned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {tab === "questions" && (
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {question?.map((q) => (
              <tr key={q.id}>
                <td>{q.title}</td>
                <td>{q.status}</td>
                <td>
                  <button
                    className={q.isBlocked ? "unblock-btn" : "block-btn"}
                    onClick={() => handleBlockQuestion(q.id, q.isBlocked)}
                  >
                    {q.isBlocked ? "UnBlock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}


  </div>
);

}