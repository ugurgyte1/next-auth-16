"use client"

import { Controller, useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import zod from "zod";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useEffect, useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorPage from "@/app/auth/error/page";
import Link from "next/link";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { useDialogStore } from "@/hooks/store/use-dialog-store";

const LoginForm = () => { 

  const {isOpen,type,onOpen,onClose} = useDialogStore();   // Burası eklendi

  const router = useRouter(); 

  const searchParams = useSearchParams();

  const [error,setError] = useState<string | undefined>("");
  const [success,setSuccess] = useState<string | undefined>("");

  const [isPending,startTransition] = useTransition(); 

  const {setLoginData,showTwoFactor,setShowTwoFactor} = useAuthStore();

  const form = useForm<zod.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });  

  const onSubmit = (values:zod.infer<typeof loginSchema>) => {    

      startTransition(() => {
        login(values,searchParams.get("callbackUrl"))        // Bura değişti
          .then((data) => {
            if(data.success){
              setSuccess(data.success);
              setError("");
              form.setValue("email","");
              form.setValue("password","");
              
            }
            if(data.error){
              setError(data.error);
              setSuccess("");
              form.setValue("email","");
              form.setValue("password","");
            }
            if(data.twoFactor){

              const email = values.email; 
              const password = values.password;             

              setLoginData(email,password); // zustand ile ilgili kullanım

              setShowTwoFactor();  // Burası eklendi              

              onClose();   // Burası eklendi

             // router.push(`/auth/two-factor`);    // Bura devre dışı bırakıldı          
             
              onOpen("two-factor",searchParams.get("callbackUrl") ?? "");       

            }
          })
      })
  } 

 

  useEffect(() => {             // Bu kısım eklendi   

    if(!showTwoFactor){       // Bu kısım eklendi      

      const callbackUrl = searchParams.get("callbackUrl");

      if(callbackUrl){
        if(!isOpen && !type){
          onOpen("login",callbackUrl);
        }
      }

    }

  },[])
  
  const urlError = searchParams.get("error");

  if(urlError === "OAuthAccountNotLinked"){
    return (
      <ErrorPage/>
    )
  }  

  return (
    <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account"
        backButtonHref="/auth/register"
        showSocial
    >
      {showTwoFactor === false ? (
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
                  <Button
                      className="flex flex-col items-start justify-center px-0"
                      variant={"link"}
                      size={"sm"}
                  >
                    <Link href={"/auth/forgot-password"}>
                      Forgot password
                    </Link>
                  </Button>
                  <FormError message={error}/>
                  <FormSuccess message={success}/>
                  <Button
                    className="cursor-pointer w-full mt-1"
                    variant={"default"}
                    size={"lg"}
                    disabled={isPending}
                  >
                    Login
                  </Button>            
              </form>
      ) : (null) }

    </CardWrapper>
  )
}

export default LoginForm;
