import { authorCollection } from '~/core/spec'

import { createRestClient } from './index'

// Example usage of the REST client
async function example() {
  // Create the REST client
  const client = createRestClient({
    baseUrl: 'https://api.example.com',
    collections: [authorCollection],
  })

  // Example: Read a single author
  const author = await client.authors.findOne({ id: '123' })
  console.log('Author:', author)

  // Example: Read multiple authors with pagination and sorting
  const authors = await client.authors.findMany({
    limit: 10,
    offset: 0,
    orderBy: 'name',
    orderType: 'asc',
  })

  console.log('Authors:', authors)

  // Example: Create a new author
  const newAuthor = await client.authors.create({
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      postIds: [],
    },
  })
  console.log('New author:', newAuthor)

  // Example: Update an author
  const updatedAuthor = await client.authors.update({
    id: '123',
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      postIds: [],
    },
  })
  console.log('Updated author:', updatedAuthor)

  // Example: Delete an author
  const deletedAuthor = await client.authors.delete({ id: '123' })
  console.log('Deleted author:', deletedAuthor)
}

// Run the example
example().catch(console.error)
