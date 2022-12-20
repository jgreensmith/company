import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";

import { usePriceContext } from '../utils/context/PriceContext'
import Loader from '../components/svg/Loader'
import Layout from '../components/common/Layout';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { CenteredDiv, InputContainer } from '../utils/styles';


const GoogleStripe = () => {

  const { data: session, status } = useSession({required: true})
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState(null)
  const { selectedPrice } = usePriceContext()
  const router = useRouter()

  //push to pricing if new user logs in without selecting pricing options

  
  const selectPrice = async () => {
    const res: any = await signOut({
      redirect: false,
      callbackUrl: '/pricing'
    })
    if(res.error) {
      console.log(res.error)
    } else {

      router.push(res.url)
      toast.error("Please select a pricing option")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(status === "authenticated") {

      await fetch('/api/add-store-name', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ companyName, id: session.user.id })
      }) 
      .then((res) => res.json())
      .then((data) => {
        if(data.error) {
          setError(data.error) 
        } else {
          checkout()
        }
      })
    }
  }

  const checkout = async () => {

    if(selectedPrice?.length > 1 || selectedPrice[0] === "price_1LvH0PJlND9FCfnv12qQYH1P") {
      
      await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ priceList: selectedPrice})
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.error) {
            console.log(data.error)
          } else {
            router.push(data.url)
          }
        })
   
    } else {
      router.push('/noCustomerSuccess')
    }
  }

  useEffect (() => {
    if(!localStorage.getItem('price')) {
      //checkout()
      selectPrice()
    } 
  }, [])

  if(status === 'loading') return <Loader message="Loading..." />


  return (
    <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
      <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
        <CenteredDiv>
            <Typography color='black' variant='h5'>Please enter your Store name</Typography>
        </CenteredDiv>
        <Divider />
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <CenteredDiv>
          <InputContainer >
            <TextField 
              name="companyName"
              value={companyName}
              variant="filled"
              fullWidth
              label="Store Name"       
              sx={{backgroundColor: "#f1f3fa"}}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </InputContainer>
          </CenteredDiv>
          <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, pr: 1}}>

            <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>Submit</Button>
          </CenteredDiv>
        </form>
        { error &&
          <CenteredDiv>
            <Typography variant='body1' color='red'>{error}</Typography>
          </CenteredDiv>
        } 
      </Box>
    </Box>

  )
  
}



export default GoogleStripe  