interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      {props.children}
    </div>
  )
}

function LeftPanel() {
  return (
    <div className="bg-muted hidden w-1/2 items-center justify-center p-10 md:flex">
      <div className="flex flex-col justify-between p-20">
        <div className="mb-4 text-2xl font-semibold">⌘ Ishtar</div>
        <blockquote className="text-muted-foreground">
          “This library has saved me countless hours of work and helped me deliver stunning designs
          to my clients faster than ever before.”
        </blockquote>
      </div>
    </div>
  )
}
