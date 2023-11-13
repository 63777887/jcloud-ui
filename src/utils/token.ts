export const SET_ACCESS_TOKEN = (accessToken: string) => {
  localStorage.setItem('ACCESS_TOKEN', accessToken)
}
export const SET_REFRESH_TOKEN = (refreshToken: string) => {
  localStorage.setItem('REFRESH_TOKEN', refreshToken)
}
export const GET_ACCESS_TOKEN = (): string => {
  return localStorage.getItem('ACCESS_TOKEN')
}
export const GET_REFRESH_TOKEN = (): string => {
  return localStorage.getItem('REFRESH_TOKEN')
}
export const REMOVE_ACCESS_TOKEN = () => {
  return localStorage.removeItem('ACCESS_TOKEN')
}
export const REMOVE_REFRESH_TOKEN = () => {
  return localStorage.removeItem('REFRESH_TOKEN')
}
