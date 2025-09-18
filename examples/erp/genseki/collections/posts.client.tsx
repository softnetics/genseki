'use client'

import type React from 'react'
import { useState } from 'react'
import { type SubmitErrorHandler, type SubmitHandler, useFormContext } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import z from 'zod'

import type { CollectionLayoutProps, InferCreateFields } from '@genseki/react'
import {
  actionsColumn,
  Button,
  CollectionListToolbar,
  createDeleteActionItem,
  createEditActionItem,
  createSeparatorItem,
  Form,
  type InferFields,
  SubmitButton,
  TanstackTable,
  toast,
  Typography,
  useCollectionCreate,
  useCollectionCreateMutation,
  useCollectionDeleteMutation,
  useCollectionForm,
  useCollectionList,
  useCollectionListQuery,
  useGenseki,
  useListTable,
  useNavigation,
  useTableStatesContext,
} from '@genseki/react'

import type { fields } from './posts'

type Post = InferFields<typeof fields>
const columnHelper = createColumnHelper<Post>()

export const columns = [
  columnHelper.group({
    id: 'id',
    header: () => <div className="flex items-center">ID</div>,
    columns: [
      columnHelper.accessor('__id', {
        header: () => <div className="flex items-center">ID</div>,
        cell: (info) => <div className="flex items-center">{info.getValue()}</div>,
      }),
      columnHelper.accessor('title', {
        header: () => <div className="">Title</div>,
        cell: (info) => info.getValue(),
      }),
    ],
  }),
  columnHelper.accessor('author.name', {
    header: 'Author Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('author.email', {
    header: 'Author Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('postDetail.description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => <div>{new Date(info.getValue()).toLocaleDateString('en-GB')}</div>,
  }),
  actionsColumn([createEditActionItem(), createSeparatorItem(), createDeleteActionItem()]),
]

/**
 * @description This is an example how you can use the given `CollectionListToolbar` from Genseki,
 * you may use custom toolbar here whehter you want.
 */
export function PostClientToolbar() {
  const context = useCollectionList()

  return (
    <div>
      <CollectionListToolbar toolbar={context.toolbar} />
    </div>
  )
}

/**
 * @description This is an example how you can use the given `TanstackTable` and `CollectionListPagination` from Genseki to compose your view.
 */
export const PostClientTable = (props: { children?: React.ReactNode }) => {
  const context = useCollectionList()
  const { setRowSelection } = useTableStatesContext()

  const queryClient = useQueryClient()

  const navigation = useNavigation()

  // Example of fethcing list data
  const query = useCollectionListQuery({ slug: context.slug })

  const deleteMutation = useCollectionDeleteMutation({
    slug: context.slug,
    onSuccess: async () => {
      setRowSelection({})
      await queryClient.invalidateQueries({
        queryKey: ['GET', `/${context.slug}`],
      })
      toast.success('Deletion successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  })

  const table = useListTable({
    total: query.data?.total,
    data: query.data?.data || [],
    columns: context.columns,
  })

  return (
    <>
      <TanstackTable
        table={table}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
        configuration={{
          sortBy: context.sortBy,
        }}
      />
    </>
  )
}

export function Layout(props: CollectionLayoutProps) {
  const {
    components: { AppTopbar, AppSidebar, AppSidebarInset, AppSidebarProvider },
  } = useGenseki()

  return (
    <AppSidebarProvider>
      <AppSidebar />
      <AppSidebarInset>
        <AppTopbar />
        {props.children}
      </AppSidebarInset>
    </AppSidebarProvider>
  )
}

export function CustomListPage() {
  const {
    components: {
      ListBanner,
      ListTableContainer,
      ListTablePagination,
      ListTable,
      ListTableToolbar,
    },
  } = useCollectionList<Post>()

  return (
    <>
      <ListBanner />
      <ListTableContainer>
        <PostClientToolbar />
        <PostClientTable />
        <ListTablePagination />
      </ListTableContainer>
    </>
  )
}

interface SimpleTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string
}
const SimpleTextInput = ({ fieldName, ...rest }: SimpleTextInputProps) => {
  const { register } = useFormContext()

  return <input {...rest} {...register(fieldName)} />
}

interface CancelButtonProps {
  pending?: boolean
}
const CancelButton = ({ pending }: CancelButtonProps) => {
  const {
    formState: { isDirty },
  } = useFormContext()
  const { navigate } = useNavigation()

  const handleCancel = () => {
    if ((isDirty && confirm('You have unsaved changes, sure to leave?')) || !isDirty)
      return navigate('./')
  }

  return (
    <Button size="md" variant="destruction" onClick={handleCancel} isDisabled={pending}>
      {pending ? 'Submitting...' : 'Cancel'}
    </Button>
  )
}

type CreatePostFields = InferCreateFields<typeof fields>
const CreatePostSchema = z.object({
  example: z.string().min(1),
  author: z.object({
    connect: z
      .uuid()
      .optional()
      .refine((id) => !!id, { error: 'Please select some author' }),
  }),
  content: z.any(),
  postTags: z.any(),
  title: z.string().min(1),
  postDetail: z.any(),
})

export const CustomCreatePage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { navigate } = useNavigation()
  const {
    components: { CreateFormLayout, CreateField },
  } = useCollectionCreate<CreatePostFields>()

  const form = useCollectionForm<CreatePostFields>({
    resolver: zodResolver(CreatePostSchema),
  })

  const mutation = useCollectionCreateMutation<CreatePostFields>({
    onSuccess: () => {
      toast.success('Post published', { position: 'top-center' })
      return navigate(`./`)
    },
    onError: ({ message }) => setErrorMessage(`Error: ${message}`),
    onMutate: () => setErrorMessage(null),
  })

  const handleValidationError: SubmitErrorHandler<CreatePostFields> = (errors) =>
    setErrorMessage(
      [
        errors.author?.message && `AUTHOR: ${errors.author?.message}`,
        errors.author?.connect?.message && `AUTHOR.CONNECT: ${errors.author?.connect?.message}`,
        errors.example?.message && `EXAMPLE: ${errors.example?.message}`,
        errors.title?.message && `TITLE: ${errors.title.message}`,
      ]
        .filter((e) => e !== undefined)
        .join(',')
    )

  const handleSubmit: SubmitHandler<CreatePostFields> = (data) => mutation.mutateAsync(data)

  return (
    <CreateFormLayout>
      <Typography
        type="h2"
        weight="semibold"
        className={errorMessage === null ? 'text-black' : 'text-red-500'}
      >
        Publish a new article
      </Typography>
      {errorMessage && (
        <Typography type="body" weight="bold" className="text-red-500">
          {errorMessage}
        </Typography>
      )}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSubmit, handleValidationError)}
          className="flex flex-col gap-y-8 mt-16"
        >
          <CreateField fieldName="example" />
          <SimpleTextInput
            fieldName="title"
            placeholder="Custom Title Input"
            className="border-2 rounded-sm border-purple-500 p-4"
          />
          <CreateField fieldName="content" />
          <CreateField fieldName="author" />
          <CreateField fieldName="postTags" />
          <CreateField fieldName="postDetail" />
          <div className="grid grid-cols-2 gap-4">
            <SubmitButton pending={mutation.isPending}>Create</SubmitButton>
            <CancelButton pending={mutation.isPending} />
          </div>
        </form>
      </Form>
    </CreateFormLayout>
  )
}
