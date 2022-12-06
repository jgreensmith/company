import { getSession, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
 
import Layout from '../components/common/Layout'
import Loader from '../components/svg/Loader'
import dbConnect from '../lib/dbConnect'
import User from '../model/User'
import { CenteredDiv } from '../utils/styles'

const Account = ({user}) => {
  const { data: session, status } = useSession({required: true})

  const router = useRouter()
  
  const customerPortal = async () => {
      await fetch('/api/customer-portal', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: session.user.id})
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

  useEffect(() => {
    if(user.customerId) {
      customerPortal()
    }
  }, [])
//TODO finish this - also make holiday mode false
  const handleAccountCreationClick = async () => {
    await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceList: ['become_customer']})
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

  if(user.customerId) return <Loader message="loading stripe account settings" />

  return (
    <Layout title='account' seo='account'>
account
<CenteredDiv>
  {/* make button disabled on holiday mode */}
  <button onClick={handleAccountCreationClick}>do you want an account?</button>

</CenteredDiv>
    </Layout>
  )
  
}

export default Account

export async function getServerSideProps(ctx) {
  try {
    await dbConnect()
    const session = await getSession(ctx)

    const user = await User.findById({_id: session.user.id})
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        session
      }
    }
  } catch (error) {
    console.log(error)
  }
}
  
