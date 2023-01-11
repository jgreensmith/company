import { Alert, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiFillCheckCircle } from 'react-icons/ai'
import Loader from '../../components/svg/Loader'

import { CenteredDiv } from '../../utils/styles'

const VerifyEmail = () => {
    const router = useRouter()
    const [data, setData] = useState(null)

    const getData = async () => {
        await fetch('/api/verify-email', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: router.query.token })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                console.log(data.error)
            } else {
                setData(data)
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    if(!data) return <Loader message='loading' />

    console.log(data)

    return (
    <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            <CenteredDiv>
                
                <Alert sx={{ display: 'flex', justifyContent: 'center', border: '1px solid green', p: {vs: '0 40px', sm: '0 70px'}}} icon={<AiFillCheckCircle />} severity='success'>
                    <Typography variant='h2' align='center' sx={{width: '100%'}} >Email Verification Successful</Typography>
                </Alert>
                <Typography variant='body2'>You may now safely close this tab</Typography>
                
            </CenteredDiv>
        </Box>
    </Box>

  )
}

export default VerifyEmail

