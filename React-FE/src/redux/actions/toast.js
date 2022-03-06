export const ADD_TOAST = 'ADD_TOAST'

export const addToast = (toast) => {
  return {
    type: ADD_TOAST,
    payload: toast,
  }
}
