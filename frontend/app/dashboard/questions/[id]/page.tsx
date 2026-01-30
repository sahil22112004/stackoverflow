'use client'

import { useParams } from "next/navigation";
import ViewQuestion from "./view";


export default function viewpage(){
    const params = useParams();
     const id = params?.id
    return (
        <>
         <ViewQuestion id={id} />
        </>


    )
}