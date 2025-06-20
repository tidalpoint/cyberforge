export const pluralize = (count: number, singular: string, plural = singular + 's') => {
  return `${count} ${count === 1 ? singular : plural}`
}
