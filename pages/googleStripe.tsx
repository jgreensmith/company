import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from "react-hot-toast";

import { usePriceContext } from '../utils/context/PriceContext'
import Loader from '../components/svg/Loader'


const GoogleStripe = () => {

  const { data: session, status } = useSession()
  const { selectedPrice } = usePriceContext()
  const router = useRouter()

  //push to pricing if new user logs in without selecting pricing options

  // const selectPrice = async () => {
  //   if(status === "authenticated") {
  //     await fetch('/api/google-reroute', {
  //       method: 'DELETE',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // @ts-ignore
  //       body: JSON.stringify({id: session.user.id})
  //     })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if(data.error) {
  //         console.log(data.error)
  //       } else {
  //         handleSignOut()
  //       }
  //     })

      
  //   }
  // }
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

  const createStripe = async () => {
    await fetch('/api/create-stripe', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: session.user.email})
    })
    .then((res) => res.json())
    .then((data) => {

      if (data.error) {
        console.log(data.error) 
      } else {
        router.push(data.url)
      } 
    })  
  }

  const stripeSetUp = async () => {

    if(status === "authenticated") {
      
      await fetch('/api/google-customer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({email: session.user.email, id: session.user.id, priceList: selectedPrice})
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.error) {
            console.log(data.error)
          } else {
            createStripe()
          }
        }) 

     
          
    } 
  }

  useEffect (() => {
    if(localStorage.getItem('price')) {
      stripeSetUp()
    } else {
      selectPrice()
    }
  }, [session])


  return <Loader />
  
}



export default GoogleStripe  