export const getComplianceColor = (score: number, scale = 5) => {
  if (score / scale <= 0.5) {
    return 'var(--major)'
  }

  if (score / scale <= 0.7) {
    return 'var(--minor)'
  }

  return 'var(--compliant)'
}
