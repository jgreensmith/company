import { signOut, useSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Loader from '../components/svg/Loader'

const Cancelled = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  // const cancel = async () => {
  //   await fetch('/api/delete', {
  //     method: 'DELETE',
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     //@ts-ignore
  //     body: JSON.stringify({id: session.user.id, email: session.user.email})
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //     }
  //   })
  // }
  
  useEffect(() => {
    //cancel()
    signOut()
    router.push('/auth')
  }, [])
  

  return <Loader message='checkout cancelled' />
}

export default Cancelled