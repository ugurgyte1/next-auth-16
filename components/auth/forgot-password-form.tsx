"use client"

import { Controller, useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import zod from "zod";
import { forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { forgotPassword } from "@/actions/forgot-password";

const ForgotPasswordForm = () => {  

  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition();

  const form = useForm<zod.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""      
    }
  });

  const onSubmit = (values:zod.infer<typeof forgotPasswordSchema>) => {

      startTransition(() => {
        forgotPassword(values)
          .then((data) => {
            if(data.success){
              setSuccess(data.success);
              setError("");
              form.setValue("email","");              
            }
            if(data.error){
              setError(data.error);
              setSuccess("");
              form.setValue("email","");              
            }
          })
      })
  }

  return (
    <CardWrapper
        headerLabel="Forgot password"
        backButtonLabel="Return to login"
        backButtonHref="/auth/login"        
    >
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
            <Controller
              name="email"
              control={form.control}
              render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="john.doe@example.com"
                    autoComplete="on"
                    type="email"
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

export default ForgotPasswordForm;