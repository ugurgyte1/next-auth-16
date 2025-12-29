"use client"

import { Controller, useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import zod from "zod";
import { twoFactorSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { twoFactor } from "@/actions/two-factor";
import { useAuthStore } from "@/hooks/store/use-auth-store";;
import { useSearchParams } from "next/navigation";

const TwoFactorForm = () => { 

  const searchParams = useSearchParams();
  
  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition();

  const form = useForm<zod.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: ""      
    }
  });

  const {email,password,clearLoginData} = useAuthStore(); 

  const onSubmit = (values:zod.infer<typeof twoFactorSchema>) => {    

    if(!email || !password){
      setError("Missing credentials, please try again");
      return;
    }

      startTransition(() => {
        twoFactor(values,email,password,searchParams.get("callbackUrl"))   // Burada parametre ilave edildi
          .then((data) => {
            if(data.success){
              setSuccess(data.success);
              setError("");
              form.setValue("code",""); 
              clearLoginData();             
            }
            if(data.error){
              setError(data.error);
              setSuccess("");
              form.setValue("code","");              
            }
          })
      })
  } 

  return (
    <CardWrapper
        headerLabel="Two Factor Authentication"
        backButtonLabel="Back to Sign In "     // Burası değişti
        backButtonHref="/auth/login"        
    >
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
            <Controller
              name="code"
              control={form.control}
              render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Two factor code:</FieldLabel>
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

export default TwoFactorForm;