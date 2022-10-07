import { NextPage } from 'next'
import React from 'react'
import { useSession, signIn, getProviders } from "next-auth/react";

import { Box } from '@mui/material';



const Auth: NextPage = ({providers}: any) => {
  return (
    <Box className='auth-background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>A

    </Box>
  )
}

export default Auth

export async function getServerSideProps() {
    return {
        props: {
            providers: await getProviders()
        }
    }
}