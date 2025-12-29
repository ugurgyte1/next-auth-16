"use client"

interface FormSuccessProps {
    message: string | undefined
}

const FormSuccess = ({
    message
}:FormSuccessProps) => {

    if(!message){
        return null;
    }

  return (
    <div className="flex items-start bg-emerald-100 text-emerald-400 rounded-md px-5 py-2 text-sm">
        {message}
    </div>
  )
}

export default FormSuccess;