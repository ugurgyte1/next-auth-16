"use client"

import { useSearchParams } from "next/navigation";
import { CardContent } from "../ui/card";
import CardWrapper from "./card-wrapper";
import { useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import {BeatLoader} from "react-spinners";
import FormError from "./form-error";
import FormSuccess from "./form-success";

const NewVerificationForm = () => {

    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    useEffect(() => {

        const handleVerification = () => {

            if(!token){
                setError("Missing token");
                return;
            }

            newVerification(token)
                .then((data) => {
                    if(data.error){
                        setError(data.error);
                        setSuccess("");
                    }
                    if(data.success){
                        setSuccess(data.success);
                        setError("");
                    }
                })
        }

        handleVerification();

    },[token])

  return (
    <CardWrapper
        headerLabel="Confirming your account"
        backButtonLabel="Return to login"
        backButtonHref="/auth/login"
    >
        <CardContent>
            {!error && !success && (
                <BeatLoader/>
            )}
            <FormError message={error}/>
            <FormSuccess message={success}/>
        </CardContent>
    </CardWrapper>
  )
}

export default NewVerificationForm;