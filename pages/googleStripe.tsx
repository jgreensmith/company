import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Loader from '../components/svg/Loader'


const GoogleStripe = () => {

  const { data: session, status } = useSession()
  const router = useRouter()
    const stripeSetUp = async () => {

      if(status === "authenticated") {
        
        await fetch('/api/google-customer', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          // @ts-ignore
          body: JSON.stringify({email: session.user.email, id: session.user.id})
          })
          .then((res) => res.json())
          .then((data) => {

            console.log(data)
          }) 

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
    }

    useEffect(() => {
      stripeSetUp()
    }, [session])


  return <Loader />
  
}



export default GoogleStripe  