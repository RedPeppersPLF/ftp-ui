export const getJwt: () => string | null = () => {
  return sessionStorage.getItem("jwt");
}

export const setJwt: (jwt: string) => void = (jwt: string) => {
  if(jwt==="") {
    sessionStorage.removeItem("jwt")
  } else {
    sessionStorage.setItem("jwt", jwt)
  }
}