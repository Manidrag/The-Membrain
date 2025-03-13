import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "./css/ThemeProvider"
import { useTranslation } from "react-i18next"
import { Home, FileText, Search, PlusCircle, LogOut, Moon, Sun, Menu, X, Globe, Settings , Table } from "lucide-react"
import SearchComponent from "./search"

const Sidebar = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const LINK=import.meta.env.VITE_API_URL;

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const navItems = [
    { 
      path: "/dashboard", 
      icon: <Home size={22} />, 
      label: t("dashboard") 
    },
    { 
      path: "/all-notes", 
      icon: <FileText size={22} />, 
      label: t("allNotes") 
    },
    { 
      path: "/create-note", 
      icon: <PlusCircle size={22} />, 
      label: t("createNote") 
    },
     {
      path: "#",
      icon: <Search size={22} />,
      label: t("semanticSearch"),
      onClick: (e) => {
        e.preventDefault()
        setIsSearchOpen(true)
        setIsMobileOpen(false)
      }
    },
      { 
        path: "/settings",
        icon: <Settings size={22 }/>, 
        label: t("settings"),

      
      },{ 
        path: "/team",
        icon: <Table size={22 }/>, 
        label: t("team"),

      
      }
      
    
  ]

  const isActive = (path) => location.pathname === path

  const renderNavItems = () => (
    <nav className="flex-1 px-2 space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={item.onClick}
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
            isActive(item.path)
              ? "bg-accent-primary bg-opacity-20 text-accent-primary"
              : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary"
          }`}
        >
          {item.icon}
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  )

  const renderSettings = (isMobile = false) => (
    <div className="px-2 mt-6 space-y-1">
      {/* Language Selector */}
      <div className="w-full px-4 py-3 rounded-lg text-text-secondary hover:bg-sidebar-hover transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Globe size={22} />
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
              !isMobile && isCollapsed ? "opacity-0" : "opacity-100"
            }`}>
              {t("language")}
            </span>
          </div>
          {(!isCollapsed || isMobile) && (
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-sidebar-hover text-text-secondary border border-border-light rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all duration-300"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
            </select>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-full flex items-center px-4 py-3 rounded-lg text-text-secondary hover:bg-sidebar-hover hover:text-text-primary transition-all duration-300"
      >
        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
          !isMobile && isCollapsed ? "opacity-0" : "opacity-100"
        }`}>
          {theme === "dark" ? t("lightMode") : t("darkMode")}
        </span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center px-4 py-3 rounded-lg text-text-secondary hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 transition-all duration-300"
      >
        <LogOut size={22} />
        <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
          !isMobile && isCollapsed ? "opacity-0" : "opacity-100"
        }`}>
          {t("logout")}
        </span>
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-sidebar-bg text-text-primary hover:bg-sidebar-hover transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar-bg backdrop-blur-md border-r border-border-light transform transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col py-6">
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
              {t("membrain")}
            </h1>
          </div>
          {renderNavItems()}
          {renderSettings(true)}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed inset-y-0 left-0 z-40 flex-col py-6 transition-all duration-300 bg-sidebar-bg backdrop-blur-md border-r border-border-light ${
          isCollapsed ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className={`px-4 mb-8 overflow-hidden ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? (
            <div className="h-8 w-8 mx-auto rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
              M
            </div>
          ) : (
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
              {t("membrain")}
            </h1>
          )}
        </div>
        {renderNavItems()}
        {renderSettings()}
      </div>

      {/* Search Modal */}
      <SearchComponent 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}

export default Sidebar