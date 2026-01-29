'use client'

import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import './dashboard.css'

export default function Dashboard(){

    const user:any = useSelector((state:RootState)=>state.auth.currentUser)

    return (
        <>
        <header className="header">
            <button className="dummy-btn" >About</button>
            <button className="dummy-btn" >Product</button>
            <button className="dummy-btn" >For Team</button>
            <input className="search-section" type="text" placeholder="Search Your Question.." />
            <button className="AskQuestion-btn">Ask a Question</button>
            {user?(
                <button className="logout-btn">Log Out</button>
            ):(
                <div className="login-btns">
                <button className="signin-btn" >Sign Up</button>
                <button className="login-btn" >Log In</button>
                </div>
            )
            }
        </header>
        <div className="main-section">
            <div className="left-section"></div>
            <div className="right-section" ></div>
        </div>
        </>
    )

}