// TODO: combine this with color func
export const getComplianceName = (score: number, scale = 5) => {
  if (score / scale <= 0.5) {
    return 'Major Deficiency'
  }

  if (score / scale <= 0.7) {
    return 'Minor Deficiency'
  }

  return 'Compliant'
}
