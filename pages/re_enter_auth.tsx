import { Box, Button, Divider, FilledInput, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import dbConnect from '../lib/dbConnect'
import User from '../model/User'
import { usePriceContext } from '../utils/context/PriceContext'
import { CenteredDiv, InputContainer } from '../utils/styles'


const ReEnterAuth = ({isVerified, user}) => {

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { selectedPrice } = usePriceContext()
    
    const router = useRouter()

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const checkout = async () => {
        if(selectedPrice.length > 1 || selectedPrice[0] === "price_1LvH0PJlND9FCfnv12qQYH1P") {
  
          await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ priceList: selectedPrice})
            
          })
          .then((res) => res.json())
          .then((data) => {
            if(data.error) {
              console.log(data.error)
            } else {
              loginUser(data.url)
            }
          })
        } else {
          loginUser('/noCustomerSuccess')
        }
        
    }

    const loginUser = async (url: string) => {
    
        if(localStorage.getItem('googleRerouted')) {
          localStorage.removeItem('googleRerouted')
        }
  
        const res: any = await signIn("credentials", {
            redirect: false,
            email: user.email,
            password,
            callbackUrl: '/dashboard'
        })
        
        if (res.error) {
          setError(res.error)  
        } else {
          router.push(url)      
        } 
      }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        checkout()
    }

  return (

<Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            { isVerified ?
                <React.Fragment>

                <CenteredDiv>
                <Typography color='black' variant='body1'>
                    Please Re-enter your password
                </Typography>
            </CenteredDiv>
            <Divider />
            
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <CenteredDiv sx={{ml: 2, mt: 2, pr: 1}}>
                    <Typography variant='h6'>{user.email}</Typography>
                    <InputContainer >
                    <FormControl sx={{width: '100%'}} >
                      <FilledInput
                        name='password'
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        sx={{backgroundColor: "#f1f3fa"}}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPassword}
                              edge="end"
                              >
                              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Password"
                        />
                  </FormControl>
                  </InputContainer>
                  
                    {error && <Typography variant="body1" sx={{color: 'error.main'}} >{error}</Typography>}

                    <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, pr: 1}}>

                    <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>Sign In</Button>
                    </CenteredDiv>
                    </CenteredDiv>
   
                
                  </form>
                        </React.Fragment>
                :
                    <CenteredDiv>
                        <Typography variant='h3'>Please Verify Your Email</Typography>
                        <Typography variant='h6'>An email verification link has been sent to the email provided,
                        return to this page and refresh once you have verified your email</Typography>
                        <button onClick={() => location.reload()}>refresh</button>
                    </CenteredDiv>
                }
        </Box>
    </Box>  )
}

export default ReEnterAuth

export async function getServerSideProps(context: any) {

    try {
        
    

    let isVerified: boolean
        
    await dbConnect()

    // @ts-ignore
    const query = await User.findOne({hashedEmail: context.query.token})
    const user = JSON.parse(JSON.stringify(query))

    isVerified = user?.isVerified ? user.isVerified : false
   
    return {
        props: {
            user,
            isVerified
        }
    }
} catch (error) {
     console.log(error)   
}
}