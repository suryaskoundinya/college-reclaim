"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Sparkles, Users, TrendingUp, Shield, Trophy } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Enhanced Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-tight transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Lost something?{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Found something?
            </span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-base md:text-lg leading-7 md:leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            College Reclaim is your comprehensive platform for reporting and finding lost items on campus. 
            Join our trusted community of students helping each other recover their belongings safely and efficiently.
          </motion.p>
          <motion.div 
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/report/lost" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3"
                  aria-label="Report a lost item"
                >
                  📋 Report Lost Item
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/report/found" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-300 shadow-md hover:shadow-lg transition-all duration-300 font-semibold px-6 py-3"
                  aria-label="Report a found item"
                >
                  ✅ Report Found Item
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/search" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 text-violet-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold px-6 py-3"
                  aria-label="Browse all lost and found items"
                >
                  🔍 Browse All Items
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.section 
          className="mt-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20 transition-colors duration-300"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          aria-labelledby="quick-actions-heading"
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 id="quick-actions-heading" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">Quick Actions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base transition-colors duration-300">What would you like to do today?</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/report/lost" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-red-100 hover:border-red-200 bg-gradient-to-br from-red-50 to-pink-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.div 
                        className="text-5xl mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        😢
                      </motion.div>
                      <h3 className="font-bold text-xl text-red-700 group-hover:text-red-800 mb-2">I Lost Something</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Report your lost item with details and get help from the community</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-5 w-5 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link href="/report/found" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-emerald-100 hover:border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.div 
                        className="text-5xl mb-4"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        🎉
                      </motion.div>
                      <h3 className="font-bold text-xl text-emerald-700 group-hover:text-emerald-800 mb-2">I Found Something</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Help someone recover their item and make their day better</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-5 w-5 text-emerald-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link href="/search" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-violet-100 hover:border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.div 
                        className="text-5xl mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        🔍
                      </motion.div>
                      <h3 className="font-bold text-xl text-violet-700 group-hover:text-violet-800 mb-2">Browse Items</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Search through all lost & found items in the database</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-5 w-5 text-violet-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">Our Impact</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg transition-colors duration-300">See how we're helping the campus community</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="text-center group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Users className="text-white w-8 h-8" />
              </motion.div>
              <dt className="mt-6 text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">500+</dt>
              <dd className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Active Students</dd>
            </motion.div>
            <motion.div 
              className="text-center group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: -5 }}
              >
                <TrendingUp className="text-white w-8 h-8" />
              </motion.div>
              <dt className="mt-6 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">1,200+</dt>
              <dd className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Items Recovered</dd>
            </motion.div>
            <motion.div 
              className="text-center group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Shield className="text-white w-8 h-8" />
              </motion.div>
              <dt className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">95%</dt>
              <dd className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Success Rate</dd>
            </motion.div>
            <motion.div 
              className="text-center group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: -5 }}
              >
                <Trophy className="text-white w-8 h-8" />
              </motion.div>
              <dt className="mt-6 text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">24h</dt>
              <dd className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Average Recovery Time</dd>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/50 to-indigo-600/50"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl text-white mb-2">Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-violet-100 mb-8 text-lg">
                  Join thousands of students helping each other recover lost items every day.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link href="/auth/signup" prefetch={true}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="secondary" size="lg" className="bg-white text-violet-700 hover:bg-gray-50 shadow-lg font-semibold">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/search" prefetch={true}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="lg" className="text-white border-2 border-white hover:bg-white hover:text-violet-600 shadow-lg font-semibold transition-all duration-300">
                        Browse Items
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">College Reclaim</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Helping college communities recover lost items and build trust through technology.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <h4 className="font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">Quick Links</h4>
              <div className="space-y-3">
                <div><Link href="/report/lost" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Report Lost Item</Link></div>
                <div><Link href="/report/found" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Report Found Item</Link></div>
                <div><Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Search Items</Link></div>
                <div><Link href="/auth/signup" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Join Community</Link></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <h4 className="font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">Support</h4>
              <div className="space-y-3">
                <div><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Help Center</a></div>
                <div><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Contact Us</a></div>
                <div><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Privacy Policy</a></div>
                <div><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Terms of Service</a></div>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="border-t mt-8 pt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">&copy; 2025 College Reclaim. Made with ❤️ by Surya.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
