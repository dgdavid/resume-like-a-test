export const isWhite = (value) => {
  if (value) {
    return ['white', '#fff', '#ffffff'].includes(value.toLowerCase())
  }

  return false
}
