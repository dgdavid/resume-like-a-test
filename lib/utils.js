const MARKDOWN_LINK_REGEXP = /(\[(.*?)\]\()(.+?)(\))/

export const isWhite = (value) => {
  if (value) {
    return ['white', '#fff', '#ffffff'].includes(value.toLowerCase())
  }

  return false
}

export const findMarkdownLink = (text) => {
  const match = text.match(MARKDOWN_LINK_REGEXP)

  return [match != undefined, match]
}
