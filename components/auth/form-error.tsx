"use client"

interface FormErrorProps {
    message: string | undefined
}

const FormError = ({
    message
}:FormErrorProps) => {

    if(!message){
        return null;
    }

  return (
    <div className="flex items-start bg-destructive/15 text-destructive rounded-md px-5 py-2 text-sm">
        {message}
    </div>
  )
}

export default FormError;