import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import dbConnect from "../lib/dbConnect";
import User from "../model/User";
import { usePriceContext } from '../utils/context/PriceContext';

const Dashboard = (users) => {
  const { data: session, status } = useSession({required: true})
  const { selectedPrice } = usePriceContext()


  // const customerIdCheck = async () => {
  //   await fetch('/api/customer-check', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json",

  //     },
  //     body: JSON.stringify({id: session.user.id})
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
      
  //       console.log(data)
      
  //   })
  // }
  // useEffect(() => {
  //   if(status === "authenticated") {
  //     customerIdCheck()
  //   }
  // }, [session])

  // const check = () => {
  //   return {
  //   items: selectedPrice.map((priceId) => {
  //     return {price: priceId}
  //   })
  // }
  // }
  
  //console.log(check())

  if(status === "loading") return <Loader />
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>

  return (
    <Layout>welcome {session?.user.name} to your dutty dashboard

    </Layout>
  )
}

export default Dashboard

export async function getServerSideProps() {
  try {
    await dbConnect()
    // @ts-ignore
    const user = await User.find({})
    return {
      props: {users: JSON.parse(JSON.stringify(user))}
    }
  } catch (error) {
    console.log(error)
  }
}
  
