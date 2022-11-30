import { Box, Card, CardHeader, Stack, Switch, Typography } from '@mui/material';
import { getSession, signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useState } from 'react';
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import dbConnect from "../lib/dbConnect";
import User from "../model/User";
import { usePriceContext } from '../utils/context/PriceContext';
import { FlexStart } from '../utils/styles';

const Dashboard = ({user}) => {
  const { data: session, status } = useSession({required: true})
  const { selectedPrice } = usePriceContext()
  const [isHoliday, setIsHoliday] = useState(user.holidayMode)

  useEffect(() => {
    if(status === "authenticated") {
      holidayHandler()
    }
  }, [isHoliday])

  const handleHolidayChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setIsHoliday(e.target.checked)
  }

  const holidayHandler = async () => {
    await fetch('/api/holiday-mode', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      //@ts-ignore
      body: JSON.stringify({id: session.user.id, holidayBool: isHoliday})
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })  }


  if(status === "loading") return <Loader message='loading dashboard' />
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>

  //console.log(user)
  return (
    <Layout title='Dashboard' seo='dashboard'>
        <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>

        welcome {user.name} to your dutty dashboard
        {
          user.studio &&
          <Link href={user.studio} >access CMS</Link>
        }
          <button >access your stripe</button>
          enter holiday mode
          <Switch checked={isHoliday} onChange={handleHolidayChange} />

        {
          user.orders && 
          <Stack spacing={2} sx={{mb: 2}}>
            {user.orders.map((order, i) => (
              <Card key={i}>
                <CardHeader title={
                  <FlexStart>
                    <Typography variant="h3">{order.customerDetails.name}</Typography>
                    <Typography variant="body1">{order.status}</Typography>
                  </FlexStart>
                }
                />
              </Card>
            ))}
          </Stack>

        }
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
  
