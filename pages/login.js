import { useSession, signIn } from 'next-auth/react'
import React from 'react'
import Layout from '../components/common/Layout'

const Login = () => {
    const { data: session } = useSession()

    
    if(session) {
        return (
            <Layout title='login'>
                <p>already signed in </p>
            </Layout>
        )
    } else {
        return (
            <Layout title='login'>
                <p>are you a new user or not?</p>
                <button onClick={() => signIn()}>signIn</button>
            </Layout>
        )
    }
}

export default Login