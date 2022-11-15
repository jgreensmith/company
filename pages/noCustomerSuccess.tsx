import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Loader from '../components/svg/Loader'

interface DataObj {
  accountLink: any,
  account: any

}

const NoCustomerSuccess = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true
      })

    const addConnectAccount = async (dataObj: DataObj) => {
      await fetch('/api/add-connect', {
        method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            // @ts-ignore
            body: JSON.stringify({id: session.user.id, connectId: dataObj.account.id})
      })
      .then((res) => res.json()
      .then((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          router.push(dataObj.accountLink.url)
        }
      }))
    }

    const createStripe = async () => {
        if (status === "authenticated") {

        await fetch('/api/create-stripe', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            // @ts-ignore
            body: JSON.stringify({ email: session.user.email})
            })
            .then((res) => res.json())
            .then((data) => {
        
                if (data.error) {
                console.log(data.error) 
                } else {
                  addConnectAccount(data)
                } 
            }) 
        }
    }

    useEffect(() => {
      createStripe()
      localStorage.removeItem("price")
    }, [session])
    

    return <Loader message="Your secure account is under construction" />

}

export default NoCustomerSuccess