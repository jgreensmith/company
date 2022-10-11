import { signIn, useSession } from 'next-auth/react'
import React from 'react'
import Layout from '../components/common/Layout'

const Dashboard = () => {
  const { data: session, status } = useSession({required: true})

  if(status === "loading") return <div>Loading...</div>
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>


  return (
    <Layout>welcome {session?.user.name} to your account settings

    </Layout>
  )
}

export default Dashboard


  