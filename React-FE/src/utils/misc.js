export const calculateClaimedCost = (claim) => {
  const claimedCost = (claim.policy.supportPercent * claim.totalCost) / 100
  const roundedToOneDecimal = Math.round(claimedCost * 10) / 10
  return roundedToOneDecimal
}
