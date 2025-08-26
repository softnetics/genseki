import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

import {
  BackColorExtension,
  CustomImageExtension,
  ImageUploadNodeExtension,
  SelectionExtension,
} from '@genseki/react'

import { columns, PostClientPagination, PostClientTable, PostClientToolbar } from './posts.client'

import { EditorSlotBefore } from '../editor/slot-before'
import { builder, prisma } from '../helper'

export const postEditorProviderProps = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: true,
  content: '<h2>This came from Post content field</h2>',
  slotBefore: <EditorSlotBefore />,
  extensions: [
    Color,
    BackColorExtension,
    Underline.configure({ HTMLAttributes: { class: 'earth-underline' } }),
    SelectionExtension,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    StarterKit.configure({
      bold: { HTMLAttributes: { class: 'bold large-black' } },
      paragraph: { HTMLAttributes: { class: 'paragraph-custom' } },
      heading: { HTMLAttributes: { class: 'heading-custom' } },
      bulletList: { HTMLAttributes: { class: 'list-custom' } },
      orderedList: { HTMLAttributes: { class: 'ordered-list' } },
      code: { HTMLAttributes: { class: 'code' } },
      codeBlock: { HTMLAttributes: { class: 'code-block' } },
      horizontalRule: { HTMLAttributes: { class: 'hr-custom' } },
      italic: { HTMLAttributes: { class: 'italic-text' } },
      strike: { HTMLAttributes: { class: 'strikethrough' } },
      blockquote: { HTMLAttributes: { class: 'blockquote-custom' } },
    }),
    CustomImageExtension.configure({ HTMLAttributes: { className: 'image-displayer' } }),
    ImageUploadNodeExtension.configure({
      showProgress: false,
      accept: 'image/*',
      maxSize: 1024 * 1024 * 10, // 10MB
      limit: 3,
    }),
  ],
}

export const fields = builder.fields('post', (fb) => ({
  example: fb.columns('id', {
    type: 'selectText',
    label: 'Example',
    description: 'This is an example of a select text field',
    options: 'example',
  }),
  title: fb.columns('title', {
    type: 'text',
    label: 'Title',
    description: "Post's title name",
  }),
  content: fb.columns('content', {
    type: 'richText',
    required: true,
    label: 'Food description',
    editor: postEditorProviderProps,
  }),
  author: fb.relations('author', (fb) => ({
    type: 'connect',
    label: 'Author',
    required: true,
    fields: fb.fields('user', (fb) => ({
      name: fb.columns('name', {
        type: 'text',
        label: 'Name',
        description: 'The name of the author',
      }),
      email: fb.columns('email', {
        type: 'text',
        label: 'Email',
        description: 'The email of the author',
      }),
    })),
    updatedAt: fb.columns('updatedAt', {
      type: 'date',
      label: 'Updated At',
      description: 'The date the post was updated',
    }),
    options: 'author',
  })),
  createdAt: fb.columns('createdAt', {
    type: 'date',
    label: 'Created At',
    hidden: true,
    description: 'The date the post was created',
  }),
  postTags: fb.relations('postTags', (fb) => ({
    type: 'create' as const,
    label: 'Tags',
    fields: fb.fields('postTag', (fb) => ({
      remark: fb.columns('remark', {
        type: 'text',
        label: 'Remark',
      }),
      tag: fb.relations('tag', (fb) => ({
        type: 'connect' as const,
        fields: fb.fields('tag', (fb) => ({
          name: fb.columns('name', {
            type: 'text',
            label: 'Name',
          }),
        })),
        options: 'tag',
      })),
    })),
  })),
  updatedAt: fb.columns('updatedAt', {
    type: 'date',
    label: 'Updated At',
    hidden: true,
    description: 'The date the post was updated',
  }),
}))

export const options = builder.options(fields, {
  example: () => {
    return {
      options: [
        {
          label: 'example1',
          value: 'example1',
        },
        {
          label: 'example2',
          value: 'example2',
        },
        {
          label: 'example3',
          value: 'example3',
        },
        {
          label: 'example4',
          value: 'example4',
        },
      ],
    }
  },
  author: async ({ body }) => {
    if (body.title === 'DISABLED') {
      return {
        disabled: true,
        options: [],
      }
    }
    const authors = await prisma.user.findMany({ select: { id: true, name: true } })
    return {
      disabled: false,
      options: authors.map((author) => ({ label: author.name ?? '(No Name)', value: author.id })),
    }
  },
  tag: async () => {
    const tags = await prisma.tag.findMany({ select: { id: true, name: true } })
    return {
      disabled: false,
      options: tags.map((tag) => ({ label: tag.name, value: tag.id })),
    }
  },
})

const list = builder.list(fields, {
  columns: columns,
  configuration: {
    search: ['title'],
    sortBy: ['updatedAt', 'title'],
  },
  options: options,
  actions: { create: true, delete: true, one: true, update: true },
  uis: {
    layout(args) {
      const CollectionLayout = args.CollectionLayout
      const CollectionSidebar = args.CollectionSidebar
      const SidebarProvider = args.SidebarProvider
      const SidebarInset = args.SidebarInset
      const TopbarNav = args.TopbarNav

      /**
       * @description You can use following template for simple scaffolding
       *  return (
       *   <CollectionLayout>
       *     <TopbarNav />
       *     {args.children}
       *   </CollectionLayout>
       *  )
       */

      return (
        <>
          <SidebarProvider>
            <CollectionSidebar />
            <SidebarInset>
              <TopbarNav />
              <div>{args.children}</div>
            </SidebarInset>
          </SidebarProvider>
        </>
      )
    },
    page(args) {
      const ListViewContainer = args.ListViewContainer
      const ListView = args.ListView
      const Banner = args.Banner

      /**
       * @description You can also use the following template for simple scaffolding
       *
       * ```return (
       * <div>
       *   <Banner />
       *   <ListViewContainer>
       *     <ListView />
       *   </ListViewContainer>
       * </div>
       * )```
       */

      return (
        <div>
          <Banner />
          <ListViewContainer>
            <PostClientToolbar />
            <PostClientTable />
            <PostClientPagination />
          </ListViewContainer>
        </div>
      )
    },
  },
})

const create = builder.create(fields, {
  options: options,
})

const update = builder.update(fields, {
  options: options,
})

const _delete = builder.delete(fields, {
  options: options,
})

const one = builder.one(fields, {
  options: options,
})

export const postsCollection = builder.collection({
  slug: 'posts',
  list: list,
  create: create,
  update: update,
  delete: _delete,
  one: one,
})
