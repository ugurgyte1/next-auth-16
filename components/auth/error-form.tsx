"use client"

import CardWrapper from "./card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorForm = () => {
  return (
    <CardWrapper
        headerLabel="Ooooops! Something went wrong!..."
        backButtonLabel="Back to Sign In"
        backButtonHref="/"
    >
        <div className="flex gap-x-2 py-2 px-3 rounded-lg items-center justify-center bg-destructive/15 text-destructive">
            <ExclamationTriangleIcon/>
            <p className="text-sm">
              Email already in use with different provider
            </p>
        </div>
    </CardWrapper>
  )
}

export default ErrorForm;