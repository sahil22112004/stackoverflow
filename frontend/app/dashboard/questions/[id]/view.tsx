"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import { RootState, AppDispatch } from "../../../redux/store"
import { apiGetQuestionById } from "../../../services/questinsApi"
import {
  apiCreateAnswer,
  apiGetAnswersForQuestion,
  apiGetRepliesForAnswer,
  apiMarkValid,
} from "@/app/services/answerApi"
import { voteTarget } from "../../../redux/slices/voteSlice"

import TextEditor from "@/app/components/muitiptap"
import "./view.css"

const schema = z.object({
  text: z.string().min(20).max(2000).trim(),
})

type FormData = z.infer<typeof schema>

const LIMIT = 5
const REPLY_LIMIT = 3

function AnswerItem({answer,question,depth = 0,}: { answer: any ,question: any ,depth?: number}) {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.currentUser)
  const voteLoading = useSelector((s: RootState) => s.votes.loading)

  const [replies, setReplies] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showReply, setShowReply] = useState(false)

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  })

  const loadReplies = async (reset = false) => {
    const res = await apiGetRepliesForAnswer(answer.id, {
      limit: REPLY_LIMIT,
      offset: reset ? 0 : offset,
    })

    if (reset) {
      setReplies(res.replies)
      setOffset(res.replies.length)
    } else {
      setReplies(prev => [...prev, ...res.replies])
      setOffset(o => o + res.replies.length)
    }

    setHasMore(res.replies.length === REPLY_LIMIT)
  }

  const toggleReplies = async () => {
    if (expanded) {
      setExpanded(false)
      setReplies([])
      setOffset(0)
      setHasMore(false)
      return
    }

    await loadReplies(true)
    setExpanded(true)
  }

  const submitReply = async (data: FormData) => {
    if (!user) return

    await apiCreateAnswer({
      questionId: answer.questionId,
      userId: String(user.id),
      answer: data.text,
      parentAnswerId: answer.id,
    })

    reset()
    setShowReply(false)
    await loadReplies(true)
    setExpanded(true)
  }

  const vote = (status: "upvote" | "downvote") => {
    if (!user || voteLoading) return

    dispatch(
      voteTarget({
        targetId: answer.id,
        targetType: "answer",
        userId: String(user.id),
        status,
      })
    )
  }

  const markValid = async () => {
    await apiMarkValid({ id: answer.id, isValid: true })
  }

  const showArrow =
    typeof answer.replyCount === "number"
      ? answer.replyCount > 0
      : true

  return (
    <div className="ansBlock" style={{ marginLeft: depth * 24 }}>
      <div className="voteandcomment">
        <div className="votebtn">
          <KeyboardArrowUpIcon onClick={() => vote("upvote")} />
          <div className="voteScore">{answer.score}</div>
          <KeyboardArrowDownIcon onClick={() => vote("downvote")} />
        </div>

        <div
          className="answerText"
          dangerouslySetInnerHTML={{ __html: answer.answer }}
        />

        {answer.isValid && (
          <h4>
            <CheckCircleIcon /> valid
          </h4>
        )}

        {answer.parentAnswerId === null &&
          !answer.isValid &&
          question?.userId === user?.id && (
            <button onClick={markValid}>Mark valid</button>
          )}
      </div>

      <div className="replyActions">
        <button className="replyBtn" onClick={() => setShowReply(v => !v)}>
          Reply this answer
        </button>

        {showArrow && (
          <button className="replyBtn" onClick={toggleReplies}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            {expanded ? "Hide replies" : "View replies"}
          </button>
        )}
      </div>

      {showReply && (
        <form onSubmit={handleSubmit(submitReply)} className="replyForm">
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          <button type="submit" className="subAnsBtn">
            Post Reply
          </button>
        </form>
      )}

      {expanded && (
        <div className="nestedReplies">
          {replies.map(r => (
            <AnswerItem
              key={r.id}
              answer={r}
              question={question}
              depth={depth + 1}
            />
          ))}

          {hasMore && (
            <button className="replyBtn" onClick={() => loadReplies()}>
              See more replies
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ViewQuestion({ id }: { id: string }) {
  const router = useRouter()
  const user = useSelector((s: RootState) => s.auth.currentUser)

  const [question, setQuestion] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  })

  const loadQuestion = async () => {
    const q = await apiGetQuestionById(id)
    setQuestion(q)
  }

  const loadAnswers = async (resetList = false) => {
    const res = await apiGetAnswersForQuestion(id, {
      limit: LIMIT,
      offset: resetList ? 0 : offset,
    })

    const data = res.answers ?? res

    if (resetList) {
      setAnswers(data)
      setOffset(data.length)
    } else {
      setAnswers(prev => [...prev, ...data])
      setOffset(o => o + data.length)
    }

    setHasMore(data.length === LIMIT)
  }

  useEffect(() => {
    loadQuestion()
    loadAnswers(true)
  }, [id])

  const submitAnswer = async (data: FormData) => {
    if (!user) return

    await apiCreateAnswer({
      questionId: id,
      userId: String(user.id),
      answer: data.text,
    })

    reset()
    loadAnswers(true)
  }

  if (question?.isBlocked) {
    return (
      <>
        <header className="header">
          <h2 onClick={() => router.push("/dashboard")}>Stack Overflow</h2>
        </header>
        <div className="deltedBlock">
          <h2>This Question is Deleted. No longer can be Seen</h2>
        </div>
      </>
    )
  }

  return (
    <>
      <header className="header">
        <h2 onClick={() => router.push("/dashboard")}>Stack Overflow</h2>
        <input className="search-section" placeholder="Search Your Question.." />
      </header>

      <div className="view-container">
        <div className="question-section">
          <h2>{question?.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: question?.description }} />
        </div>

        <div className="breaker">
          <h4>Your Answer</h4>
        </div>

        <form onSubmit={handleSubmit(submitAnswer)} className="form">
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          <button type="submit" className="subAnsBtn">
            Post Answer
          </button>
        </form>

        <div className="breaker">
          <h4>Answers</h4>
        </div>

        {answers.map(a => (
          <AnswerItem key={a.id} answer={a} question={question} />
        ))}

        {hasMore && (
          <button className="load-more" onClick={() => loadAnswers()}>
            Load more answers
          </button>
        )}
      </div>
    </>
  )
}
