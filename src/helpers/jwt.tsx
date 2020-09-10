export const getJwt: () => string | null = () => {
  return sessionStorage.getItem("jwt");
}

export const setJwt: (jwt: string | null) => void = (jwt: string | null) => {
  if(jwt==="" || !jwt) {
    sessionStorage.removeItem("jwt")
  } else if (!!jwt) {
    sessionStorage.setItem("jwt", jwt)
  }
}