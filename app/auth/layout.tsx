interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({
    children
}:AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-blue-400 to-blue-800">
        {children}
    </div>
  )
}

export default AuthLayout;