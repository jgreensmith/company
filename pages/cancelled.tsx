import { signOut } from 'next-auth/react'
import React, { useEffect } from 'react'

const Cancelled = () => {

  useEffect(() => {
    signOut({redirect: false})
  }, [])
  

  return (
    <div>Cancelled</div>
  )
}

export default Cancelled