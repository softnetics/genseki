import { SpinnerGapIcon } from '@phosphor-icons/react/dist/ssr'

import { BaseIcon } from '../components/primitives/base-icon'

const LoadingPage = () => {
  return (
    <div className="from-bg to-primary/10 absolute inset-0 grid h-dvh content-center justify-center bg-gradient-to-br from-50% px-20">
      <BaseIcon
        icon={SpinnerGapIcon}
        size="lg"
        weight="bold"
        className="text-primary duration animate-spin [animation-duration:_620ms]"
      />
    </div>
  )
}

export default LoadingPage
