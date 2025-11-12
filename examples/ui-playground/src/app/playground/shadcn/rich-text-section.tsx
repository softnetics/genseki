import { RichTextEditor } from '@genseki/react/v2'

import { PlaygroundCard } from '../../../components/card'
import { editorProviderProps } from '../../../components/slot-before'

export const RichTextSection = () => {
  return (
    <PlaygroundCard title="Basic RichtextEditor" categoryTitle="Component">
      <RichTextEditor editorProviderProps={editorProviderProps} />
    </PlaygroundCard>
  )
}
