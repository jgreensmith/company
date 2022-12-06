import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import Link from 'next/link'


const ExistingAccountSuccess = () => {
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
                addCustomer(data.customer)
              }
            })
        }
    }


  const addCustomer = async (customer: object) => {
    if (status === "authenticated") {
      await fetch('/api/add-customer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ id: session.user.id, customerId: customer.id })
      })
    }
  }

  useEffect(() => {
    getData(sessionId)
  }, [sessionId, session])
  
  if(status === "loading") return <Loader message='Adding Customer Id to database' />
  
  return (
    <Layout title="success" seo="success">
    

    <div>Success, thankyou {session?.user.name} for choosing to do buisness with greensmith merchants</div>
    <Link href='/dashboard'>Return to Dashboard</Link>
    </Layout>
  )
}

export default ExistingAccountSuccess