"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

import { RootState, AppDispatch } from "../../../redux/store"
import { apiGetQuestionById } from "../../../services/questinsApi"
import {
  apiCreateAnswer,
  apiGetAnswersForQuestion,
  apiGetRepliesForAnswer,
  apiMarkValid,
} from "@/app/services/answerApi"
import { voteTarget } from "../../../redux/slices/voteSlice"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import TextEditor from "@/app/components/muitiptap"
import "./view.css"

const schema = z.object({
  text: z.string().min(20).max(2000).trim(),
})

type FormData = z.infer<typeof schema>

const LIMIT = 5

function AnswerItem({ answer ,question}: { answer: any ,question:any}) {

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.currentUser)
  const voteLoading = useSelector((s: RootState) => s.votes.loading)

  const [replies, setReplies] = useState<any[]>([])
  const [showReply, setShowReply] = useState(false)
  
  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  })

  const loadReplies = async () => {
    console.log('THIS IS ALSO WORK')
    const data = await apiGetRepliesForAnswer(answer.id)
    console.log('DATA IS',data)
    setReplies(data)
  }

  useEffect(() => {
    loadReplies()
  }, [answer.id])

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
    loadReplies()
  }

  const vote = (status: "upvote" | "downvote") => {
    console.log('this block work ')
    if (!user || voteLoading) return

    dispatch(
      voteTarget({
        targetId: answer.id,
        targetType: "answer",
        userId: String(user.id),
        status,
      })
    )
    loadReplies()
  }

  const handleMarkValid = async(id:any)=>{
    console.log(id,"ui")
    const validData ={
      id:id,
      isValid:true
    }
    const res = await apiMarkValid(validData)
  }

  return (
    <div className="ansBlock" >
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
      {answer.isValid && <h4><CheckCircleIcon/> valid</h4>}
      {(answer.parentAnswerId==null && answer.isValid==false && question.userId == user?.id ) &&
      <button onClick={()=>handleMarkValid(answer.id)}>Mark valid</button>

      }
        </div>

      <button className="replyBtn" onClick={() => setShowReply(v => !v)}>
        Reply this answer
      </button>
      

      {showReply && (
        <form onSubmit={handleSubmit(submitReply)} className="replyForm">
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {/* {errors.description && (
          <p className="error">{errors.description.message}</p>
        )} */}
          <button type="submit" className="subAnsBtn">
            Post Reply
          </button>
        </form>
      )}

      {replies.map(r => (
        <AnswerItem key={r.id} answer={r}  question={question}/>
      ))}
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
  if(question?.isBlocked){
    return (
      <div>
        <header className="header">
        <h2 onClick={() => router.push("/dashboard")}>Stack Overflow</h2>
        <input className="search-section" placeholder="Search Your Question.." />
      </header>
      <div className="deltedBlock">
        <h2>This Question is Deleted. No longer can be Seen</h2>
      </div>
      </div>
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
