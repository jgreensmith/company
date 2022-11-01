import { Box } from '@mui/material';
import { getSession, signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import React, { useEffect } from 'react'
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import dbConnect from "../lib/dbConnect";
import User from "../model/User";
import { usePriceContext } from '../utils/context/PriceContext';

const Dashboard = ({user}) => {
  const { data: session, status } = useSession({required: true})
  const { selectedPrice } = usePriceContext()


  if(status === "loading") return <Loader />
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>

  console.log(user)
  return (
    <Layout>
        <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>

        welcome {user.name} to your dutty dashboard
        {
          user.studio &&
              <Link href={user.studio} >access CMS</Link>
        }
              <button >access your stripe</button>

        </Box>
    </Layout>
  )
}

export default Dashboard

export async function getServerSideProps(ctx) {
  try {
    await dbConnect()
    const session = await getSession(ctx)
    // @ts-ignore
    const user = await User.findById({_id: session.user.id})
    return {
      props: {user: JSON.parse(JSON.stringify(user))}
    }
  } catch (error) {
    console.log(error)
  }
}
  
