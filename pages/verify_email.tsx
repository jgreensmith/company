import { Alert, Box, Typography } from '@mui/material'
import React from 'react'
import { AiFillCheckCircle } from 'react-icons/ai'
import dbConnect from '../lib/dbConnect'
import User from '../model/User'
import { CenteredDiv } from '../utils/styles'

const VerifyEmail = ({isVerified}: any) => {
  return (
    <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            <CenteredDiv>
                { isVerified ?
                    <React.Fragment>
                    <Alert sx={{ display: 'flex', justifyContent: 'center', border: '1px solid green', p: {vs: '0 40px', sm: '0 70px'}}} icon={<AiFillCheckCircle />} severity='success'>
                        <Typography variant='h2' align='center' sx={{width: '100%'}} >Email Verification Successful</Typography>
                    </Alert>
                    <Typography variant='body2'>You may now safely close this tab</Typography>
                    </React.Fragment>
                : 
                    <React.Fragment>

                    <Alert sx={{ display: 'flex', justifyContent: 'center', border: '1px solid green', p: {vs: '0 40px', sm: '0 70px'}}} icon={<AiFillCheckCircle />} severity='success'>
                        <Typography variant='h2' align='center' sx={{width: '100%'}} >Email Verification Successful</Typography>
                    </Alert>
                    <Typography variant='body2'>You may now safely close this tab</Typography>
                    </React.Fragment>
                }
            </CenteredDiv>
        </Box>
    </Box>

  )
}

export default VerifyEmail

export async function getServerSideProps(context: any) {
    try {

    let isVerified: boolean
    
    await dbConnect()

    // @ts-ignore
    const query = await User.findOneAndUpdate({hashedEmail: context.query.token},
        {isVerified: true}
    )
    const user = JSON.parse(JSON.stringify(query))

    isVerified = user?.isVerified ? user.isVerified : false
    
    return {
        props: {
            isVerified
        }
    }
} catch (error) {
    console.log(error)    
}
}