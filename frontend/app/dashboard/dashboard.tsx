'use client'

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../redux/store"
import { fetchAllQuestions, resetQuestions } from "../redux/slices/questionSlice"
import './dashboard.css'

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const observerRef = useRef<HTMLDivElement | null>(null)

  const user = useSelector((state: RootState) => state.auth.currentUser)
  const { questions, loading, hasMore, offset } = useSelector(
    (state: RootState) => state.questions
  )

  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    dispatch(resetQuestions())
    dispatch(fetchAllQuestions({ offset: 0, limit: 10, search, tags }))
  }, [search, tags])

  useEffect(() => {
    if (!observerRef.current || loading || !hasMore) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        dispatch(fetchAllQuestions({ offset, limit: 10, search, tags }))
      }
    })

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [offset, loading, hasMore, search, tags])

  return (
    <>
      <header className="header">
        <button className="dummy-btn">About</button>
        <button className="dummy-btn">Product</button>
        <button className="dummy-btn">For Team</button>
        <input
          className="search-section"
          placeholder="Search Your Question.."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="AskQuestion-btn">Ask a Question</button>
        {user ? (
          <button className="logout-btn">Log Out</button>
        ) : (
          <div className="login-btns">
            <button className="signin-btn">Sign Up</button>
            <button className="login-btn">Log In</button>
          </div>
        )}
      </header>

      <div className="main-section">
        <div className="left-section"></div>

        <div className="right-section">
          {questions.map(q => (
            <div key={q.id} className="question-card">
              <h3 className="question-title">{q.title}</h3>
              <p className="question-desc">
                {q.description.length > 120
                  ? q.description.slice(0, 120) + "..."
                  : q.description}
              </p>

              <div className="tag-row">
                {q.tags.map(tag => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>

              <div className="question-footer">
                <span className="status-badge">{q.status}</span>
                <span className="date-text">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {loading && <p className="loading-text">Loading...</p>}
          <div ref={observerRef}></div>
        </div>
      </div>
    </>
  )
}
