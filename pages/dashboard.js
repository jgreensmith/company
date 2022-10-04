//import { signIn, useSession } from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../components/common/Layout'
import { unstable_getServerSession } from 'next-auth/next'

const Dashboard = () => {
  //const { data: session, status } = useSession()

  //if(status === "loading") return <div>Loading...</div>
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>


  return (
    <Layout>this is the dutty dashboard

    </Layout>
  )
}

export default Dashboard

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}