import { authorCollection } from '~/core/spec'

import { useForm } from './hooks'

export default function Example() {
  const form = useForm({ collection: authorCollection })

  return (
    <div>
      <form onSubmit={form.onSubmit}>
        <input type="text" {...form.register('name')} />
        <input type="submit" />
      </form>
    </div>
  )
}
