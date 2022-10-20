import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
 
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'

const Dashboard = () => {
  const { data: session, status } = useSession({required: true})

  const router = useRouter()
  
  const customerPortal = async () => {
    if(status === "authenticated") {
      await fetch('/api/customer-portal', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: session.user.id})
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          router.push(data.url)
        }
      })
    }
  }

  useEffect(() => {
    customerPortal()
  }, [session])

  return <Loader />
  
}

export default Dashboard


  
