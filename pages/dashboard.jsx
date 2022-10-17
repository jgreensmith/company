import { signIn, useSession } from 'next-auth/react'
import React from 'react'
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'

const Dashboard = () => {
  const { data: session, status } = useSession({required: true})

  if(status === "loading") return <Loader />
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>

  return (
    <Layout>welcome {session?.user.name} to your dutty dashboard

    </Layout>
  )
}

export default Dashboard


  
