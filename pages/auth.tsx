import { NextPage } from 'next'
import React, { ChangeEvent, useState } from 'react'
import { useSession, signIn, getProviders } from "next-auth/react";

import { Box, Button, Container, Typography, Divider, TextField, IconButton, InputAdornment, FilledInput, InputLabel, FormControl } from '@mui/material';
import { CenteredDiv, InputContainer } from '../utils/styles'
import { FcGoogle } from 'react-icons/fc'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

interface IFormData {
  email: string
  password: string
}


const Auth: NextPage = ({providers} : any) => {
    const [authType, setAuthType] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")


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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if(!authType) {
        const registerData = {
          name: `${firstName} ${lastName}`,
          email: formData.email,
          password: formData.password
        }
        console.log(registerData)
      } else {
        
        console.log(formData)
      }
      
    }


  return (
    <Box className='auth-background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            <CenteredDiv>
                <Typography variant='h5'>{authType ? "Login" : "Register"}</Typography>
                <Typography variant='body1'>

                    {authType ? 
                        "Not registered yet?"
                    : 
                        "Already have an account?"
                    }
                    <Button variant='text' sx={{textTransform: 'capitalize'}} onClick={() => setAuthType(!authType)}>
                    {!authType ? "Login" : "Register"}
                    </Button>
                </Typography>
            </CenteredDiv>
            <Divider />
            <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, p: '0 10px'}}>
                <Button fullWidth variant='contained' startIcon={<FcGoogle  />} sx={{backgroundColor: "#000000e0", p: 1}} onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
                    <Typography variant="body1" align='center' sx={{textTransform: 'capitalize', pl: 2}}>{authType ? "Login" : "Register"} With Google</Typography> 
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
                    <FormControl sx={{width: '100%'}} >
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
                  </InputContainer>
                      )
                    }
                    <Button  variant="contained" size="large" type="submit" fullWidth sx={{p:2}}>Submit</Button>

                    </CenteredDiv>
   
                
                  </form>
        </Box>
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