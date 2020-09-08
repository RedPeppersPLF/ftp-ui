export const getTheme: () => string | null = () => {
  return sessionStorage.getItem("theme");
}

export const setTheme: (theme: string) => void = (theme: string) => {
  if(theme==="light") {
    sessionStorage.setItem("theme", theme)
  } else if (theme==="dark") {
    sessionStorage.setItem("theme", theme)
  }
}