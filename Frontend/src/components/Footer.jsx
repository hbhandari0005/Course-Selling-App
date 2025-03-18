import React from 'react'

function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">
      &copy; {new Date().getFullYear()} CourseBaazar. All Rights Reserved.
    </p>
  </footer>
  )
  
}

export default Footer