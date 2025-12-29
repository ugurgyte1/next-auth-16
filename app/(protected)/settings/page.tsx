"use client"

import { settings } from "@/actions/settings";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { settingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import zod from "zod";

const SettingsPage = () => {  

    const {onClose} = useDialogStore();        // bura eklendi

    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");
  
    const [isPending,startTransition] = useTransition();
    
    const {update} = useSession();

    const user = useCurrentUser();   
    
    const form = useForm<zod.infer<typeof settingsSchema>>({

      resolver: zodResolver(settingsSchema),
      defaultValues: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "" ,
        newPassword: "",
        role: user?.role ?? "USER",
        isTwoFactor: user?.isTwoFactor ?? false
      }

    }) 

    const onSubmit = (values:zod.infer<typeof settingsSchema>) => {
        startTransition(() => {
            settings(values)
              .then((data) => {
                if(data.success){
                  setSuccess(data.success);
                  setError("");
                  update();
                }
                if(data.error){
                  setSuccess("");
                  setError(data.error);
                }
              })
        })
    }
    
    useEffect(() => {

      onClose();         // Bura eklendi
      update();      

    },[])

    useEffect(() => {             // Bu useEffect() eklendi

      if(user){

        form.reset({
          name: user.name ?? "",
          email: user.email ?? "",
          password: "",
          newPassword: "",
          role: user.role ?? "USER",
          isTwoFactor: user.isTwoFactor ?? false

        })

      }

    },[user])

  return (
    <Card className="w-[600px] space-y-2">
      <CardHeader>
        <h1 className="text-center font-semibold text-xl">⚙️ Settings Page</h1>
      </CardHeader>
      <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
              <Controller 
                name="name"
                control={form.control}
                render={({field,fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name:</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="on"
                      type="name"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {user?.isOAuth === true ? (null) : (          // Burayı ekledik
                <>
                    <FieldSeparator className="my-2"/>
                    <Controller 
                      name="email"
                      control={form.control}
                      render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email">Email:</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="john.doe@example.com"
                            autoComplete="on"
                            type="email"
                            disabled={isPending}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />  
                    <FieldSeparator className="my-2"/>
                    <Controller 
                      name="password"
                      control={form.control}
                      render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="password">Password:</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="******"
                            autoComplete="off"
                            type="password"
                            disabled={isPending}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}                
                    />  
                    <FieldSeparator className="my-2"/>
                    <Controller 
                      name="newPassword"
                      control={form.control}
                      render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="newPassword">New Password:</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="******"
                            autoComplete="off"
                            type="password"
                            disabled={isPending}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>                  
                      )}
                    /> 
                </>
              )}
              <FieldSeparator className="my-2"/>
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">
                      Role:
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        id="role"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Select a role
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {user?.isOAuth === true ? (null) : (              // Burayı ekledik
                <>
                    <FieldSeparator className="my-2"/>
                    <Controller
                      name="isTwoFactor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="isTwoFactor">
                              Two Factor Authentication
                            </FieldLabel>
                            <FieldDescription>
                              If you want two-factor-auth, switch on
                            </FieldDescription>
                          </FieldContent>
                          <Switch
                            id="isTwoFactor"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                </>
              )}
              <FieldSeparator className="my-2"/>
              <FormError message={error}/>
              <FormSuccess message={success}/>
              <Button
                className="w-full cursor-pointer mt-2"
                type="submit"
                disabled={isPending}
                size={"lg"}
              >
                Send
              </Button>
          </form>
      </CardContent>
    </Card>   
  )
}

export default SettingsPage;


