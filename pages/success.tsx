import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'


const Success = () => {
    const { data: session, status } = useSession({
      required: true
    })
    const router = useRouter()
    const sessionId = router.query.session_id;
   

    const getData = async (id: any) => {
        if(id) {
            await fetch(`/api/success?session_id=${id}`, {
                method: 'GET'
            })
            .then((res) => res.json())
            .then((data) => {
              if(data.error) {
                console.log(data.error)
              } else {
                createStripe(data.customer)
              }
            })
        }
    }


  const createStripe = async (customer: object) => {
    if (status === "authenticated") {
      await fetch('/api/add-customer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ id: session.user.id, customerId: customer.id })
      })

      await fetch('/api/create-stripe', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({id: session.user.id, email: session.user.email})
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
    getData(sessionId)
    localStorage.removeItem("price")
  }, [sessionId, session])
  
  //if(status === "loading") return <Loader />
  
  //console.log(stripeSession)
  return <Loader message="Your secure account is under construction" />
  // return (
  //   <Layout title="success" seo="success">
    

  //   <div>Success, thankyou {session?.user.name} for choosing to do buisness with greensmith merchants</div>
  //   <button onClick={createStripe}>Build your merchant account here!</button>
  //   </Layout>
  // )
}

export default Success