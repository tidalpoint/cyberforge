export const getCompliance = (score: number, scale = 5) => {
  if (score / scale <= 0.5) {
    return 'MAJOR'
  }

  if (score / scale <= 0.7) {
    return 'MINOR'
  }

  return 'COMPLIANT'
}
