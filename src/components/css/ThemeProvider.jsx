"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create theme context
const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null,
  toggleTheme: () => null, // Add toggleTheme to context
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or use dark as default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme || "dark"
  })

  // Update theme class on document and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme classes
    root.classList.remove("light-theme", "dark-theme")

    // Add current theme class
    root.classList.add(`${theme}-theme`)

    // Save to localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider

