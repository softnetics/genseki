import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import z from 'zod'

import { DatePicker, Form, FormField, FormMessage, Label } from '@genseki/react'

import { BaseFilterBox, type BaseFilterBoxInterface } from './base'

interface FilterDateInterface extends BaseFilterBoxInterface {
  updateThisFilter: (startDate?: string, endDate?: string) => void
}

const FormSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End Date must be AFTER Start date',
    path: ['endDate'],
  })

type FormSchema = z.infer<typeof FormSchema>

export function FilterDate(props: FilterDateInterface) {
  const form = useForm<FormSchema>({
    resolver: standardSchemaResolver(FormSchema),
    mode: 'all',
  })

  const handleFormUpdate = async () => {
    const values = form.getValues()
    if (!(values.startDate && values.endDate)) return // form is not ready yet

    const isValid = await form.trigger()

    if (isValid) {
      props.updateThisFilter(values.startDate.toISOString(), values.endDate.toISOString())
    } else {
      // invalid data, clear any previous filter
      props.updateThisFilter(undefined, undefined)
    }
  }

  return (
    <Form {...form}>
      <form>
        <BaseFilterBox {...props}>
          <div>
            <Label>Filter by "{props.label}"</Label>
            <div className="flex items-end gap-2 my-2">
              <FormField
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2 grow">
                    <Label>Start Date</Label>
                    <DatePicker
                      aria-label="Start Date"
                      granularity="day"
                      onChange={(sd) => {
                        const dateToDate = new Date(sd?.toString() || '')
                        field.onChange(dateToDate)
                        handleFormUpdate()
                      }}
                    />
                  </div>
                )}
              />
              <FormField
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2 grow">
                    <Label>End Date</Label>
                    <DatePicker
                      aria-label="End Date"
                      granularity="day"
                      onChange={(sd) => {
                        const dateToDate = new Date(sd?.toString() || '')
                        field.onChange(dateToDate)
                        handleFormUpdate()
                      }}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </div>
        </BaseFilterBox>
      </form>
    </Form>
  )
}
