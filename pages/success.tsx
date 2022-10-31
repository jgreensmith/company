import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Layout from '../components/common/Layout'


const Success = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const sessionId = router.query.session_id;


    const getData = async (id: any) => {
        if(id) {
            const data = await fetch(`/api/success?session_id=${id}`, {
                method: 'GET'
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
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

  useEffect(() => {
    getData(sessionId)
  }, [sessionId])
  


  return (
    <Layout title="success" seo="success">
    

    <div>Success</div>
    <button onClick={createStripe}>Build your merchant account</button>
    </Layout>
  )
}

export default Success