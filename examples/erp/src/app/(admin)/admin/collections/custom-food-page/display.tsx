'use client'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  type InferFields,
  Select,
  SelectList,
  SelectOption,
  SelectTrigger,
  SubmitButton,
  Switch,
  TextField,
  type ToClientCollection,
  useNavigation,
} from '@genseki/react'

import type { serverConfig } from '~/drizzlify/config'
import { ListTable } from '~/src/components/list.client'

import { renderFoodsCells } from './cells'

import { typesEnum } from '../../../../../../db/schema'

type FoodCollection = typeof serverConfig.collections.foods

interface IDisplayProps {
  data: InferFields<FoodCollection['fields']>[]
  collection: ToClientCollection<FoodCollection>
}

const filterFormSchema = z.object({
  name: z.string().optional(),
  isCooked: z.boolean().optional(),
  cookingType: z.enum(typesEnum.enumValues).optional(),
})

export const Display = ({ data, collection }: IDisplayProps) => {
  const { navigate } = useNavigation()

  const filterForm = useForm({
    resolver: zodResolver(filterFormSchema),
    mode: 'onChange',
  })
  async function search(data: z.infer<typeof filterFormSchema>) {
    const query = Object.entries(data)
      .map(([field, value]) => value !== undefined && `${field}=${value}`)
      .filter((v) => v)
      .join('&')

    navigate(`?${query}`)
  }
  return (
    <div className="p-16">
      <Form {...filterForm}>
        <form
          className="grid grid-cols-2 w-full items-start gap-4"
          onSubmit={filterForm.handleSubmit(search)}
        >
          <FormField
            control={filterForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextField
                    {...field}
                    name="name"
                    label="Search by name"
                    placeholder="search cooking by its name"
                    className="mb-8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={filterForm.control}
              name="isCooked"
              defaultValue={false}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch {...field} value={`${field.value}`} name="isCooked" label="Cooked?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={filterForm.control}
              name="cookingType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      placeholder="Cooking type"
                      {...field}
                      onSelectionChange={field.onChange}
                    >
                      <SelectTrigger />
                      <SelectList
                        items={typesEnum.enumValues.map((type) => ({
                          type,
                        }))}
                      >
                        {({ type }) => (
                          <SelectOption id={type} textValue={type}>
                            {type}
                          </SelectOption>
                        )}
                      </SelectList>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SubmitButton>Search</SubmitButton>
        </form>
      </Form>
      <ListTable collection={collection} data={data} renderCellFns={renderFoodsCells} />
    </div>
  )
}
