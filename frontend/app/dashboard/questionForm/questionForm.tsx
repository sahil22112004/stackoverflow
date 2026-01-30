'use client'

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { enqueueSnackbar } from "notistack"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

import "./addform.css"
import TextEditor from "@/app/components/muitiptap"
import { createQuestion } from "../../redux/slices/questionSlice"
import { RootState, AppDispatch } from "../../redux/store"

const questionSchema = z.object({
  title: z.string().min(10).max(50).trim(),
  description: z.string().min(20).max(2000).trim(),
  tags: z.string().min(1).trim(),
})

type QuestionFormData = z.infer<typeof questionSchema>

export default function AskQuestion() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { currentUser } = useSelector((state: RootState) => state.auth)
  const { loading } = useSelector((state: RootState) => state.questions)

  const [status, setStatus] = useState<"draft" | "published">("published")

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  })

  const onSubmit = (data: QuestionFormData) => {
    if (!currentUser?.id) {
      enqueueSnackbar("Please login first", { variant: "error" })
      return
    }

    const tagsArray = data.tags
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5)

    dispatch(
      createQuestion({
        title: data.title,
        description: data.description,
        tags: tagsArray,
        userId: String(currentUser.id),
        status,
      })
    )

    enqueueSnackbar("Question added successfully", { variant: "success" })
    router.push("/dashboard")
  }

  return (
    <div className="main">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h2>Ask a Question</h2>

        <input
          type="text"
          placeholder="Question title"
          {...register("title")}
        />
        {errors.title && <p className="error">{errors.title.message}</p>}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextEditor
              value={field.value}
              onChange={field.onChange}
              
            />
          )}
        />
        {errors.description && (
          <p className="error">{errors.description.message}</p>
        )}

        <input
          type="text"
          placeholder="Tags (comma separated, max 5)"
          {...register("tags")}
        />
        {errors.tags && <p className="error">{errors.tags.message}</p>}

        <div className="status-box-group">
          <div
            className={`status-box ${status === "draft" ? "active" : ""}`}
            onClick={() => setStatus("draft")}
          >
            <h4>Draft</h4>
            <p>Save privately</p>
          </div>

          <div
            className={`status-box ${status === "published" ? "active" : ""}`}
            onClick={() => setStatus("published")}
          >
            <h4>Publish</h4>
            <p>Visible to everyone</p>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Submit Question"}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}

