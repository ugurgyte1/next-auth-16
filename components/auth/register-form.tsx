"use client"

import { Controller, useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import zod from "zod";
import { registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";

const RegisterForm = () => {  

  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition(); 

  const form = useForm<zod.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (values:zod.infer<typeof registerSchema>) => {

      startTransition(() => {
        register(values)
          .then((data) => {
            if(data.success){
              setSuccess(data.success);
              setError("");
              form.setValue("name","");
              form.setValue("email","");
              form.setValue("password","");
            }
            if(data.error){
              setError(data.error);
              setSuccess("");
              form.setValue("name","");
              form.setValue("email","");
              form.setValue("password","");
            }
          })
      })
  }

  return (
    <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account"
        backButtonHref="/auth/login"
        showSocial
    >
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
            <Controller
              name="name"
              control={form.control}
              render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="on"
                    type="name"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              )}
            />
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
            <Controller
              name="password"
              control={form.control}
              render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password:</FieldLabel>
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
              <span className={`
                  inline text-[12px]
                  xxxs:inline 
                  xxs:hidden
                  xs:hidden

                `}>Register</span>
              <span className={`
                  hidden 
                  xxxs:hidden
                  xxs:inline
                  xs:inline
                `}>Create an account</span>              
            </Button>            
        </form>
    </CardWrapper>
  )
}

export default RegisterForm;