import { Typography } from '@genseki/react'

export const Wrapper = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <Typography type="h4" weight="semibold" className="text-text-nontrivial">
        {title}
      </Typography>
      {children}
    </div>
  )
}
