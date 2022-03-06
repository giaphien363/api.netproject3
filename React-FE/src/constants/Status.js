export const PolicyStatus = {
  PENDING: 1,
  ACTIVE: 2,
  REJECTED: 3,
}

export const ClaimStatus = {
  PENDING_APPROVAL: 1,
  PENDING_PAYMENT: 2,
  PAYMENT_APPROVED: 3,
  REJECTED: 4,
  PAYMENT_REJECTED: 5,
  mapToText: (status) => ClaimStatusText[status - 1],
}

export const ClaimActionStatus = {
  CREATE: 1,
  DELETE: 2,
  EDIT: 3,
  APPROVE_BY_MAN: 4,
  REJECT_BY_MAN: 5,
  REJECT_BY_FIN: 6,
  PAY: 7,
  mapToText: (status) => ClaimActionStatusText[status - 1],
  mapToStatusColor: (status) => ClaimActionStatusColor[status - 1],
}

const ClaimStatusText = [
  'Pending Approval',
  'Pending Payment',
  'Payment Approved',
  'Rejected',
  'Payment Rejected',
]

const ClaimActionStatusText = [
  'created',
  'deleted',
  'edited',
  'approved',
  'rejected',
  'rejected',
  'paid',
]

const ClaimActionStatusColor = [
  'black-50',
  'black-50',
  'black-50',
  'success',
  'danger',
  'danger',
  'success',
]
