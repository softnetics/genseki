export const isImageKey = (key: string) => {
  const clean = key.split('?')[0]
  return /\.(avif|webp|png|jpe?g|gif|bmp|svg)(?:\?.*)?$/i.test(clean)
}
