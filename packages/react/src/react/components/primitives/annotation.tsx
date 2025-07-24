import { cn } from '../../utils/cn'

interface AnnotationProps {
  children: React.ReactNode
  className?: string
}

const Annotation = ({ children, className }: AnnotationProps) => {
  return (
    <div className={cn('px-20 py-8 rounded-2xl bg-white text-bluegray-900', className)}>
      <div className="flex items-center gap-2">
        <p className="text-4xl font-bold">{children}</p>
      </div>
    </div>
  )
}

export { Annotation }
