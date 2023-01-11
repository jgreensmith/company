import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, FilledInput, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material'

import { CenteredDiv, InputContainer } from '../../utils/styles'


const ForgottenPassword = () => {

    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [timedOut, setTimedOut] = useState(false)

    const handleSubmitted = () => {
        setSubmitted(true)
        localStorage.setItem('submitted', JSON.stringify(true))
        const timer = setTimeout(() => {
            localStorage.removeItem('submitted')
            setTimedOut(true)
        }, 60000);
        return () => clearTimeout(timer);

    }
    const removeSubmit = () => {
        setSubmitted(false)
        localStorage.removeItem('submitted')
    }

    useEffect(() => {
      if(localStorage.getItem('submitted')){
        setSubmitted(true)
      }
    }, [])
    

    const sendPassChange = async () => {
        await fetch('/api/change-password', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                setError(data.error)
            } else {
                handleSubmitted()
            }
        })
    }
   
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendPassChange()
    }

if(timedOut) return (
<Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
<Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
    <CenteredDiv>
        <Typography variant='h3' gutterBottom>Page Timed Out</Typography>
        <Typography variant='h6'>you may now close this tab</Typography>
    </CenteredDiv>
</Box>
</Box>
)

  return (

<Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
        { !submitted ?
            <React.Fragment>

            <CenteredDiv>
            <Typography color='black' variant='body1'>
                Please enter your Email
            </Typography>
            </CenteredDiv>
            <Divider />
            
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <CenteredDiv sx={{ml: 2, mt: 2, pr: 1}}>
                    <InputContainer >
                        <TextField 
                            name="email" 
                            value={email}
                            variant="filled"
                            label="Email"
                            fullWidth
                            sx={{ backgroundColor: "#f1f3fa"}}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    </InputContainer>
                  
                    {error && <Typography variant="body1" sx={{color: 'error.main'}} >{error}</Typography>}

                    <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, pr: 1}}>

                    <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>Send Update Password Request</Button>
                    </CenteredDiv>
                    </CenteredDiv>
   
                
                  </form>
                </React.Fragment>

                :
                    <CenteredDiv>
                        <Typography variant='h3'>Please Check Your Email</Typography>
                        <Typography variant='h6'>An email verification link has been sent to the email provided</Typography>
                        <Button variant='text' onClick={removeSubmit}>resend?</Button>
                    </CenteredDiv>
                }
        </Box>
    </Box>  )
}

export default ForgottenPassword

