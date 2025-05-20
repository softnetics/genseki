export function withPathParams(path: string, pathParams?: Record<string, any>) {
  if (!pathParams) return path
  return path.replace(/:\w+/g, (param) => {
    const key = param.slice(1)
    if (key in pathParams) {
      return pathParams[key]
    }
    throw new Error(`Path parameter "${key}" not found in pathParams`)
  })
}

export function withQueryParams(path: string, queryParams?: any) {
  if (!queryParams) return path
  const queryString = new URLSearchParams(queryParams).toString()
  return `${path}?${queryString}`
}
