"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

import { RootState, AppDispatch } from "../redux/store"
import {
  fetchAllQuestions,
  resetQuestions,
} from "../redux/slices/questionSlice"
import { voteTarget } from "../redux/slices/voteSlice"
import { apiGetAllTags } from "../services/questinsApi"

import "./dashboard.css"

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const observerRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  const { questions, loading, hasMore, offset } = useSelector(
    (state: RootState) => state.questions
  )
  const user = useSelector((state: RootState) => state.auth.currentUser)

  const [search, setSearch] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [sortByNewest, setSortByNewest] = useState(true)
  const [sortByScore, setSortByScore] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const LIMIT = 10

  const loadQuestions = (reset = false) => {
    dispatch(
      fetchAllQuestions({
        offset: reset ? 0 : offset,
        limit: LIMIT,
        search,
        sortByNewest,
        sortByScore,
        tags: selectedTags,
      })
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(resetQuestions())
      loadQuestions(true)
    }, 400)

    return () => clearTimeout(timer)
  }, [search, sortByNewest, sortByScore, selectedTags])

  useEffect(() => {
    apiGetAllTags().then(tags => {
      setAllTags(tags.map((t: any) => t.name))
    })
  }, [])

  useEffect(() => {
    if (!observerRef.current || loading || !hasMore) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetchingRef.current) {
        isFetchingRef.current = true
        loadQuestions()
      }
    })

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [offset, loading, hasMore])

  useEffect(() => {
    if (!loading) isFetchingRef.current = false
  }, [loading])

  const voteQuestion = (questionId: string, status: "upvote" | "downvote") => {
    if (!user?.id) return

    dispatch(
      voteTarget({
        targetId: questionId,
        targetType: "question",
        userId: String(user.id),
        status,
      })
    ).then(() => {
      dispatch(resetQuestions())
      loadQuestions(true)
    })
  }

  return (
    <>
      {/* HEADER */}
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

        <button
          className="AskQuestion-btn"
          onClick={() => router.push("/dashboard/questionForm")}
        >
          Ask a Question
        </button>

        {user ? (
          <button className="logout-btn">Log Out</button>
        ) : (
          <div className="login-btns">
            <button className="signin-btn">Sign Up</button>
            <button className="login-btn">Log In</button>
          </div>
        )}
      </header>

      {/* MAIN */}
      <div className="main-section">
        <div className="left-section"></div>

        <div className="right-section">
          <div className="dashboard-header">
            <h2>All Questions</h2>
            <button
              className="filter-btn"
              onClick={() => setShowFilter(prev => !prev)}
            >
              Filter
            </button>
          </div>

          {showFilter && (
            <div className="filter-panel">
              <div className="filter-row">
                <label>
                  <input
                    type="checkbox"
                    checked={sortByNewest}
                    onChange={() => {
                      setSortByNewest(true)
                      setSortByScore(false)
                    }}
                  />
                  Newest
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={sortByScore}
                    onChange={() => {
                      setSortByScore(true)
                      setSortByNewest(false)
                    }}
                  />
                  Score
                </label>
              </div>

              <div className="filter-row">
                Filter by tags
                <select
                  multiple
                  value={selectedTags}
                  onChange={e =>
                    setSelectedTags(
                      Array.from(e.target.selectedOptions).map(o => o.value)
                    )
                  }
                >
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {questions.map(q => (
            <div key={q.id} className="question-card">
              <div className="vote-column">
                <KeyboardArrowUpIcon
                  className="vote-icon"
                  onClick={() => voteQuestion(String(q.id), "upvote")}
                />
                <div className="vote-score">{q.score}</div>
                <KeyboardArrowDownIcon
                  className="vote-icon"
                  onClick={() => voteQuestion(String(q.id), "downvote")}
                />
              </div>

              <div
                className="question-content"
                onClick={() =>
                  router.push(`/dashboard/questions/${q.id}`)
                }
              >
                <h3 className="question-title">{q.title}</h3>

                {/* <div className="tag-row">
                  {q?.tags?.map(tag => (
                    <span key={tag} className="tag-pill">S
                      {tag}
                    </span>
                  ))}
                </div> */}
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
