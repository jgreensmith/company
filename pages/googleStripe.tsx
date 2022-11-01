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

  const checkout = async () => {

    if(status === "authenticated") {
      
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


     
          
    } 
  }

  useEffect (() => {
    if(localStorage.getItem('price')) {
      checkout()
    } else {
      selectPrice()
    }
  }, [session])


  return <Loader message="authentication successfull" />
  
}



export default GoogleStripe  