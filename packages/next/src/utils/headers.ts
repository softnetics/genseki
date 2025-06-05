export const getHeadersObject = (headers: Headers): Record<string, string> => {
  const headersRecord: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersRecord[key] = value
  })
  return headersRecord
}
