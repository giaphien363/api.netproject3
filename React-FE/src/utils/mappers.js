export const toOldPolicyResponse = (item) => {
  const { companyRes, policyRes, typeRes } = item
  return {
    ...policyRes,
    company: companyRes,
    type: typeRes,
  }
}

export const toOldClaimResponse = (item) => {
  const { claimRes, policyRes } = item
  return {
    ...claimRes,
    policy: policyRes,
  }
}

export const toOldClaimDetailResponse = (item) => {
  const { claimRes, actionsRes, policyRes } = item
  return {
    ...claimRes,
    claimActions: actionsRes,
    policy: policyRes,
  }
}

export const toOldContractResponse = (item) => {
  const { contractRes, employeeRes, totalContractPolicy } = item
  return {
    ...contractRes,
    employee: employeeRes,
    totalContractPolicy,
  }
}
