import ProtectedRoute from "@/app/components/protectedRoute"
import AskQuestion from "./questionForm"



export default function addQuestionPage (){
    return (
        <>
        <ProtectedRoute>
        <AskQuestion/>
        </ProtectedRoute>
        </>
    )
}