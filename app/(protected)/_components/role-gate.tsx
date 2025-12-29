"use client"

import FormError from "@/components/auth/form-error";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
    children: React.ReactNode
    role: UserRole
}

const RoleGate = ({
    children,
    role
}:RoleGateProps) => {

    if(role !== UserRole.ADMIN){
        return (
            <div className="w-full">
                <FormError message="You are not authorized to access this route"/>
            </div>            
        )
    }

  return (
    <div>
        {children}
    </div>
  )
}

export default RoleGate;