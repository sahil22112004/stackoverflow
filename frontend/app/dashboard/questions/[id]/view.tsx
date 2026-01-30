"use client";

import { useEffect, useState } from "react";
import { apigetQuestionById } from "../../../services/questinsApi";
import "./view.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { apiCreateAnswer, apiGetAswerForQuestion } from "@/app/services/answerApi";
import { ClassNames } from "@emotion/react";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import TextEditor from "@/app/components/muitiptap";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';




export default function ViewQuestion({ id }: any) {

    const questionSchema = z.object({
        Answer: z.string().min(20).max(2000).trim(),
    })

    type QuestionFormData = z.infer<typeof questionSchema>
    const router = useRouter();
    const [question, setQuestion] = useState<any>(null);
    const [answer, setanswer] = useState<any>('')
    const [answerData, setAnswerData] = useState<any[]>([])


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            Answer: "",
        },
    })

    const user = useSelector((state: RootState) => state.auth.currentUser)

    async function loadQuestion() {
        console.log('working')
        const ques = await apigetQuestionById(String(id));
        setQuestion(ques);
    }
    async function loadAnswers() {
        console.log('working answer')
        const ans = await apiGetAswerForQuestion(String(id));
        setAnswerData(ans);
    }

    useEffect(() => {
        console.log('working')

        loadQuestion();
        loadAnswers()
    }, [id]);

    console.log('ans is ', answerData)



    const onSubmit = async (data: any) => {
        console.log("data is ", data)
        if (answer.trim() == '') {
            console.log('returning')
            return
        }
        const Ans = {
            userId: user?.id,
            Answer: data.Answer,
            questionId: id

        }
        console.log('onsubmit', Ans)
        const res = await apiCreateAnswer(Ans)
        console.log(res)
        setanswer('')
        loadAnswers()

    }



    return (
        <>
            <header className="header">
                <h2 onClick={() => router.push('/dashboard')}>Stack OverFlow</h2>
                <button className="dummy-btn">About</button>
                <button className="dummy-btn">Product</button>
                <button className="dummy-btn">For Team</button>

                <input
                    className="search-section"
                    placeholder="Search Your Question.."
                />



                {user ? (
                    <button className="logout-btn">Log Out</button>
                ) : (
                    <div className="login-btns">
                        <button className="signin-btn">Sign Up</button>
                        <button className="login-btn">Log In</button>
                    </div>
                )}
            </header>

            <div className="view-container">
                <div className="image-section">

                </div>

                <div className="question-section">
                    <h2>{question?.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: question?.description }} />

                </div>

                <div className="reply-answer">
                    <form onSubmit={handleSubmit(onSubmit)} className="form">
                        <Controller
                            name="Answer"
                            control={control}
                            render={({ field }) => (
                                <TextEditor
                                    value={field.value}
                                    onChange={field.onChange}

                                />
                            )}
                        />
                        {errors.Answer && (
                            <p className="error">{errors.Answer.message}</p>
                        )}


                        <div className="subAnsBlock" >
                            <button type="submit" className="subAnsBtn" >Post Your Answer</button>
                        </div>
                    </form>
                </div>
                <div className="breaker">
                    <h4>Answers...</h4>
                </div>
                <div>
                    {answerData?.map((ans) => {
                        return (<div className="ansBlock">
                            <div className="votebtn">
                                <KeyboardArrowUpIcon/>
                                <KeyboardArrowDownIcon/>

                            </div>
                            <div dangerouslySetInnerHTML={{ __html: ans.answer }} />
                        </div>)
                    })}
                </div>
            </div>
        </>
    );
}