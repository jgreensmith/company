import { NextPage } from 'next'
import React, { ChangeEvent, useState } from 'react'
import { useSession, signIn, getProviders } from "next-auth/react";

import { Box, Button, Container, Typography, Divider, TextField, IconButton, InputAdornment, FilledInput, InputLabel, FormControl } from '@mui/material';
import { CenteredDiv, InputContainer } from '../utils/styles'
import { FcGoogle } from 'react-icons/fc'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Email from 'next-auth/providers/email';
import { useRouter } from 'next/router';

interface IFormData {
  email: string
  password: string
}


const Auth: NextPage = () => {
    const [authType, setAuthType] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()


    const [formData, setFormData] = useState<IFormData>({
      email: "",
      password: ""
    })

    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }

  

    const register = async () => {
      if(confirmPassword === formData.password) {
        const name = `${firstName} ${lastName}`
          
        await fetch('/api/register', {
          method: 'POST',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email: formData.email, password: formData.password })
        })
        .then((res) => res.json())
        .then((data) => {
          data.error ? setError(data.error) : loginUser()
        });
        
      } else {
        setConfirmPasswordError(true)
      }
    }

    const loginUser = async () => {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard'
      })
      
      res.error ? setError(res.error) : router.push(res.url)

    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      !authType ? register() : loginUser()
    }


  return (
    <Box className='auth-background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            <CenteredDiv>
                <Typography color='black' variant='h5'>{authType ? "Log In" : "Create an account"}</Typography>
                <Typography color='black' variant='body1'>

                    {authType ? 
                        "Not registered yet?"
                    : 
                        "Already have an account?"
                    }
                    <Button variant='text' sx={{textTransform: 'capitalize'}} onClick={() => setAuthType(!authType)}>
                    {!authType ? "Log In" : "Create Account"}
                    </Button>
                </Typography>
            </CenteredDiv>
            <Divider />
            <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, p: '0 10px'}}>
                <Button fullWidth variant='contained' startIcon={<FcGoogle />} sx={{backgroundColor: "#000000e0", p: 1}} onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
                    <Typography variant="body1" align='center' sx={{textTransform: 'capitalize', pl: 2}}>{authType ? "Log In" : "Create account"} With Google</Typography> 
                </Button>
            </CenteredDiv>
            <Divider>or</Divider>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <CenteredDiv sx={{ml: 2, mt: 2, pr: 1}}>
                    {
                      !authType && (
                        <React.Fragment>

                        <InputContainer >
                            <TextField 
                                name="name"
                                value={firstName}
                                variant="filled"
                                fullWidth
                                label="First Name"       
                                sx={{backgroundColor: "#f1f3fa"}}
                                onChange={(e) => setFirstName(e.target.value)}
                                />
                        </InputContainer>
                        <InputContainer >
                            <TextField 
                                name="name"
                                value={lastName}
                                variant="filled"
                                fullWidth
                                label="Last Name"       
                                sx={{backgroundColor: "#f1f3fa"}}
                                onChange={(e) => setLastName(e.target.value)}
                                />
                        </InputContainer>                 
                        </React.Fragment>
                      )
                    }
                    <InputContainer >
                        <TextField 
                            name="email" 
                            value={formData.email}
                            variant="filled"
                            label="Email"
                            fullWidth
                            sx={{ backgroundColor: "#f1f3fa"}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    <InputContainer >
                    <FormControl sx={{width: '100%'}}>
                      <FilledInput
                        name='password'
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
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
                    {
                      !authType && (
                        <InputContainer >
                    <FormControl sx={{width: '100%'}} error={!confirmPasswordError ? false : true} >
                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        placeholder="Confirm Password"
                      />
                  </FormControl>
                  {confirmPasswordError && <Typography variant="body1" sx={{color: 'error.main'}} >Please make sure passwords match</Typography>}
                  </InputContainer>
                      )
                    }
                    {error && <Typography variant="body1" sx={{color: 'error.main'}} >{error}</Typography>}

                    <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, pr: 1}}>

                    <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>{authType ? "Log In" : "Create Account"}</Button>
                    </CenteredDiv>
                    </CenteredDiv>
   
                
                  </form>
        </Box>
    </Box>
  )
}

export default Auth

