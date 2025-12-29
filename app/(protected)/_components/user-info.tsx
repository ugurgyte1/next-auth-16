import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";

interface UserInfoProps {
    user: {
            role: "ADMIN" | "USER";
            isTwoFactor: boolean
          } & {
            id?: string | undefined;
            name?: string | null | undefined;
            email?: string | null | undefined;
            image?: string | null | undefined;
          }
    title: string
}

const UserInfo = ({
    user,
    title
}:UserInfoProps) => {
  return (
    <div className="w-[600px] bg-white p-3 rounded-lg flex flex-col items-center justify-center gap-y-2">
        <h1 className="font-semibold text-lg">
            {title}
        </h1>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Avatar : 
            </p>
            <Avatar>
                <AvatarImage className="w-20" src={`${user.image}`}/>
            </Avatar>      
        </div>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Id : 
            </p>
            <p className="truncate max-w-40">
                {user.id}
            </p>            
        </div>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Name : 
            </p>
            <p className="truncate max-w-[180px]">
                {user.name}
            </p>            
        </div>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Email : 
            </p>
            <p className="truncate max-w-[180px]">
                {user.email}
            </p>            
        </div>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Role : 
            </p>
            <p className="truncate max-w-[180px]">
                {user.role}
            </p>            
        </div>
        <div className="w-full flex items-center justify-between border-2 rounded-lg p-2 shadow-2xl text-sm">
            <p>
                Two factor authentication : 
            </p>
            <Badge 
                className="truncate max-w-[180px]"
                variant={user.isTwoFactor ? "success" : "destructive"}
            >
                {user.isTwoFactor ? "ON" : "OFF"}
            </Badge>            
        </div>
    </div>
  )
}

export default UserInfo;