import { Box, Button, Card, CardHeader, Container, Dialog, Stack, Switch, Typography } from '@mui/material';
import { getSession, signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/common/Layout'
import OrderDetails from '../../components/dashboard/OrderDetails';
import RefundConfirmation from '../../components/dashboard/RefundConfirmation';
import Loader from '../../components/svg/Loader'
import { usePriceContext } from '../../utils/context/PriceContext';

import { CenteredDiv, FlexStart } from '../../utils/styles';

interface Order {
  sessionId: string,
  customerName: string,
  orderNo: number
}

const Dashboard = () => {
  const { data: session, status } = useSession({required: true})
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(null)
  const [payouts, setPayouts] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const { priceFormatter } = usePriceContext();
  const router = useRouter()
  const payoutListRef = useRef(null)
  const scrollTo = (location: any) => {
    location.scrollIntoView(true, { behavior: "smooth" })
  }


  useEffect(() => {
    if(status === "authenticated") {
      //@ts-ignore
      getUser(session.user.id)
    }
    if(router.query.refund) {
      setRefundModalOpen(true)
    }
  }, [session])

  const getUser = async (id: string) => {
    //@ts-ignore
    await fetch(`/api/dashboard/get-user?id=${id}`, {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.error) {
        console.log(data.error)
      } else {
        setUser(data.user)
        setBalance(data.balance)
        setPayouts(data.payouts)
      }
    })
  }

  const refundHandler = async (id: string) => {
    setModalOpen(false)
    router.push(`/dashboard/authorize_refund?session_id=${id}&account_id=${user.connectedAccount}`)
    
  }
  const handleRefundClose = () => {
    setRefundModalOpen(false)
    router.push('/dashboard')
}

  const handleOrder = async (id: string, x: string) => {
    if(id) {
      setModalOpen(true)
      await fetch(`/api/dashboard/get-order?session_id=${id}&account_id=${x}`, {
          method: 'GET'
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          setOrderData(data)
        }
      })
  }
  }

  //if paid account is canceled, option to change to free by setting cusID to null

  const changeToFree = async () => {
    if(status === "authenticated") {
      await fetch('/api/dashboard/change-to-free', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        //@ts-ignore
        body: JSON.stringify({ id: session.user.id})
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          toast.success('changed to free with commission mode!')
        }
      })
    }
  }

  
  const handleNoChangeAddOns = () => {
    localStorage.setItem('price', JSON.stringify(['no_change']))
    router.push('/add-ons')
  }

  const holidayHandler = async () => {
    await fetch('/api/dashboard/holiday-mode', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      //@ts-ignore
      body: JSON.stringify({id: session.user.id})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.error) {
        console.log(data.error)
      } else {
        data.holiday ? 
        toast.success('Holiday mode activated, enjoy your break!', {duration: 4000}) 
        : toast.success('Holiday mode deactivated, welcome back!', {duration: 4000})
        location.reload()
      }
    })  
  }


  if(status === "loading") return <Loader message='awaiting authentication' />
  if(!user) return <Loader message='loading user data' />
  //if(status === "unauthenticated") return <div><span>Must be signed in</span> <button onClick={() => signIn()}>sign in</button></div>

  console.log({user})
  console.log({balance})
  console.log({payouts})

  return (
    <Layout title='Dashboard' seo='dashboard'>
        <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'scroll', pt: 10}}>
        
        welcome {user.name} to your dutty dashboard
        {
          balance && 
          <CenteredDiv>
            <Button onClick={() => scrollTo(payoutListRef.current)}>

            <Typography variant='h3'>Available: {priceFormatter(balance.available[0].amount)}</Typography>
            <Typography variant='subtitle2'>Pending: {priceFormatter(balance.pending[0].amount)}</Typography>
            </Button>
          </CenteredDiv>
        }
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
            <button onClick={holidayHandler}>{user.holidayMode ? "go back to work" : "go on holiday"}</button>
            </CenteredDiv>
            
            </>
          }
        <CenteredDiv>
          <button onClick={handleNoChangeAddOns}>add some add ons!</button>
        </CenteredDiv>
        {
          user.orders && 
          <Stack spacing={2} sx={{mb: 2}}>
            {user.orders.map((order: Order) => (
              <Card sx={{cursor: 'pointer'}} key={order.sessionId} onClick={() => handleOrder(order.sessionId, user.connectedAccount)}>
                <CardHeader title={
                  <FlexStart>
                    <Typography variant="h3">{order.customerName}</Typography>
                    <Typography variant="body1">#{order.orderNo}</Typography>
                  </FlexStart>
                }
                />
              </Card>
            ))}
          </Stack>

        }
        
        <Container >
          <Typography ref={payoutListRef} variant='subtitle2'>Payouts</Typography>
        </Container>
        
        </Box>
        <Dialog
        open={modalOpen}
        fullScreen
        onClose={() => setModalOpen(false)}
       
        >
          
          <OrderDetails props={{ order: orderData, setModalOpen, refundHandler}} />
        </Dialog> 
        <Dialog
        open={refundModalOpen}
        onClose={handleRefundClose}
        >
          <RefundConfirmation handleRefundClose={ handleRefundClose } />
        </Dialog> 
        
    </Layout>
  )
}

export default Dashboard


  
