import { Box, Card, CardHeader, Stack, Switch, Typography } from '@mui/material';
import { getSession, signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useState } from 'react';
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import dbConnect from "../lib/dbConnect";
import User from "../model/User";
import { usePriceContext } from '../utils/context/PriceContext';
import { CenteredDiv, FlexStart } from '../utils/styles';

const Dashboard = () => {
  const { data: session, status } = useSession({required: true})
  const { selectedPrice } = usePriceContext()
  const [user, setUser] = useState(null)
  const [isHoliday, setIsHoliday] = useState(user?.holidayMode)
  const router = useRouter()
  

  useEffect(() => {
    if(status === "authenticated") {
      holidayHandler()
    }
  }, [isHoliday])

  useEffect(() => {
    if(status === "authenticated") {
      //@ts-ignore
      getUser(session.user.id)
    }
  }, [session])

  const getUser = async (id: string) => {
    //@ts-ignore
    await fetch(`/api/get-user?id=${id}`, {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.error) {
        console.log(data.error)
      } else {
        setUser(data)
      }
    })
  }

  //if paid account is canceled, option to change to free by setting cusID to null

  const changeToFree = async () => {
    if(status === "authenticated") {
      await fetch('/api/change-to-free', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        //@ts-ignore
        body: JSON.stringify({ id: session.user.id})
    })
    }
  }

  
  const handleNoChangeAddOns = () => {
    localStorage.setItem('price', JSON.stringify(['no_change']))
    router.push('/add-ons')
  }

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


  if(status === "loading") return <Loader message='awaiting authentication' />
  if(!user) return <Loader message='loading user data' />
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
        {user.canceled &&
          <button onClick={changeToFree}>Change to free ?</button>
        }
          <button >access your stripe</button>
          { !user.customerId &&
          <>
            <CenteredDiv>
            <Typography>enter holiday mode</Typography>
            <Switch checked={isHoliday} onChange={handleHolidayChange} />
            </CenteredDiv>
            {/* <CenteredDiv>
              <button onClick={handleBecomeCus}>become a customer for 20pcm</button>
            </CenteredDiv> */}
            </>
          }
        <CenteredDiv>
          <button onClick={handleNoChangeAddOns}>add some add ons!</button>
        </CenteredDiv>
        {
          user.orders && 
          <Stack spacing={2} sx={{mb: 2}}>
            {user.orders.map((order, i) => (
              <Card key={i}>
                <CardHeader title={
                  <FlexStart>
                    <Typography variant="h3">{order.customerName}</Typography>
                    {/* <Typography variant="body1">{order.completed}</Typography> */}
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


  
