"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import "./addform.css";
import { createQuestion } from "../../redux/slices/questionSlice";
import { RootState, AppDispatch } from "../../redux/store";

const questionSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  tags: z.string().min(1),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function AskQuestion() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  // console.log("this is currentuser",currentUser)
  const { loading, error } = useSelector(
    (state: RootState) => state.questions
  );

  const [status, setStatus] = useState<"draft" | "published">("draft");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    if (!currentUser?.id) {
      enqueueSnackbar("Please login first", { variant: "error" });
      return;
    }

    const tagsArray = data.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    if (tagsArray.length === 0) {
      enqueueSnackbar("At least one tag required", { variant: "error" });
      return;
    }

    dispatch(
      createQuestion({
        title: data.title,
        description: data.description,
        tags: tagsArray,
        userId: "7a8c584a-7a13-4eb2-a847-110011869897",
        status,
      })
    );
  };


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

        <textarea
          placeholder="Describe your problem in detail..."
          {...register("description")}
          rows={6}
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
  );
}
