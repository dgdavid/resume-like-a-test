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

/*
 * Adds given options to passed args
 *
 * @desc useful for adding a default global options, such as `lineGap`. Take into
 * account that this method preserves the options in args if already exists.
 *
 * @param { Object } options - an object with options to add
 * @param { (number|Object)[] } args - text args
 *
 * @return { Array } args with given options
 */
export const addOptionsToTextArgs = (options, args) => {
  if (typeof args[args.length -1] === 'object') {
    options = {...options, ...args.pop()}
  }

  args.push(options)

  return args
}
