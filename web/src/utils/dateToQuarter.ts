export const dateToQuarter = (date: Date) => {
  return `Q${Math.ceil((date.getMonth() + 1) / 3)}/${date.getFullYear()}`
}

export const dateStringToQuarter = (date: string) => {
  const dateObj = new Date(date)
  return `Q${Math.ceil((dateObj.getMonth() + 1) / 3)}/${dateObj.getFullYear()}`
}
