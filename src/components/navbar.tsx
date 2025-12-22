"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Bell, User, LogOut, Settings, Sparkles, Sun, Moon, BookOpen, CalendarDays, Menu, X } from "lucide-react"
import { useTheme } from "@/components/providers"
import { useState } from "react"

export function Navbar() {
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm relative z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2 group" prefetch={true}>
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden xs:inline">
                College Reclaim
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/search" prefetch={true}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200 dark:text-gray-300">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </motion.div>
            </Link>

            <Link href="/books" prefetch={true}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 dark:text-gray-300">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Books</span>
                </Button>
              </motion.div>
            </Link>

            <Link href="/events" prefetch={true}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-200 dark:text-gray-300">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Events</span>
                </Button>
              </motion.div>
            </Link>

            {/* Theme Toggle Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200 dark:text-gray-300"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </motion.div>

            {session ? (
              <>
                <Link href="/report/lost" prefetch={true}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 hidden sm:flex">
                      <Plus className="h-4 w-4 mr-2" />
                      Lost
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/report/found" prefetch={true}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 hidden sm:flex">
                      <Plus className="h-4 w-4 mr-2" />
                      Found
                    </Button>
                  </motion.div>
                </Link>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" className="relative hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200 dark:text-gray-300">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Button>
                </motion.div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 ring-2 ring-violet-100 dark:ring-violet-800 hover:ring-violet-200 dark:hover:ring-violet-700 transition-all duration-200">
                          <AvatarImage src={session.user?.image || ""} alt="User" />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-semibold">
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none dark:text-gray-100">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer dark:text-gray-300 dark:hover:text-gray-100">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer dark:text-gray-300 dark:hover:text-gray-100">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:text-red-300">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {session.user?.role === "COORDINATOR" && (
                      <DropdownMenuItem asChild>
                        <Link href="/coordinator" className="cursor-pointer text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Coordinator Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin" prefetch={true}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 dark:text-gray-300 dark:hover:text-gray-100">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth/signup" prefetch={true}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md text-white">
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Mobile Navigation - Show Sign In/Sign Up directly */}
          <motion.div 
            className="flex md:hidden items-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!session ? (
              <>
                <Link href="/auth/signin" prefetch={true}>
                  <Button variant="ghost" size="sm" className="text-xs px-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" prefetch={true}>
                  <Button size="sm" className="text-xs px-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:bg-violet-50 dark:hover:bg-gray-800 dark:text-gray-300 px-2"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-violet-50 dark:hover:bg-gray-800 dark:text-gray-300 px-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t dark:border-gray-700 py-4"
          >
            <div className="flex flex-col space-y-2">
              <Link href="/search" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start dark:text-gray-300 h-10">
                  <Search className="h-4 w-4 mr-3" />
                  Search Items
                </Button>
              </Link>
              
              <Link href="/books" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start dark:text-gray-300 h-10">
                  <BookOpen className="h-4 w-4 mr-3" />
                  Book Marketplace
                </Button>
              </Link>
              
              <Link href="/events" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start dark:text-gray-300 h-10">
                  <CalendarDays className="h-4 w-4 mr-3" />
                  Campus Events
                </Button>
              </Link>

              {session && (
                <>
                  <div className="border-t dark:border-gray-700 my-2"></div>
                  <Link href="/report/lost" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 h-10">
                      <Plus className="h-4 w-4 mr-3" />
                      Report Lost Item
                    </Button>
                  </Link>
                  
                  <Link href="/report/found" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 h-10">
                      <Plus className="h-4 w-4 mr-3" />
                      Report Found Item
                    </Button>
                  </Link>

                  <div className="border-t dark:border-gray-700 my-2"></div>
                  
                  <Link href="/dashboard" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start dark:text-gray-300 h-10">
                      <User className="h-4 w-4 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <Link href="/profile" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start dark:text-gray-300 h-10">
                      <Settings className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                  
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 h-10">
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  
                  {session.user?.role === "COORDINATOR" && (
                    <Link href="/coordinator" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-blue-600 dark:text-blue-400 h-10">
                        <CalendarDays className="h-4 w-4 mr-3" />
                        Coordinator Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <div className="border-t dark:border-gray-700 my-2"></div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 dark:text-red-400 h-10"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Log out
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}