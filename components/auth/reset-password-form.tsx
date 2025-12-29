"use client"

import { Controller, useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import zod from "zod";
import { resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { resetPassword } from "@/actions/reset-password";  
import { useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {  

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition();

  const form = useForm<zod.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: ""      
    }
  });

  const onSubmit = (values:zod.infer<typeof resetPasswordSchema>) => {

    if(!token){
      setError("Missing token");
      return;
    }

      startTransition(() => {
        resetPassword(values,token)
          .then((data) => {
            if(data.success){
              setSuccess(data.success);
              setError("");
              form.setValue("password","");              
            }
            if(data.error){
              setError(data.error);
              setSuccess("");
              form.setValue("password","");              
            }
          })
      })
  }

  return (
    <CardWrapper
        headerLabel="Reset Password"
        backButtonLabel="Return to login"
        backButtonHref="/auth/login"        
    >
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
            <Controller
              name="password"
              control={form.control}
              render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    autoComplete="off"
                    type="password"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              )}
            />
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button
              className="cursor-pointer w-full mt-1"
              variant={"default"}
              size={"lg"}
              disabled={isPending}
            >
              Send
            </Button>            
        </form>
    </CardWrapper>
  )
}

export default ResetPasswordForm;