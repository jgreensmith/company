import { NextPage } from 'next'
import React, { useState } from 'react'
import { useSession, signIn, getProviders } from "next-auth/react";

import { Box, Button, Container, Typography, Divider, TextField, IconButton, InputAdornment, FilledInput, InputLabel, FormControl } from '@mui/material';
import { CenteredDiv, InputContainer } from '../utils/styles'
import { FcGoogle } from 'react-icons/fc'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'


const Auth: NextPage = ({providers} : any) => {
    const [authType, setAuthType] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    }
    const handleChange = () => {

    }
    const handleSubmit = () => {

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
                                name="firstname"
                                //value={authForm.firstname}
                                variant="filled"
                                fullWidth
                                label="Firstname"       
                                sx={{backgroundColor: "#f1f3fa"}}
                                onChange={handleChange}
                                />
                        </InputContainer>
                        <InputContainer>
                            <TextField 
                                name="lastname"
                                //value={authForm.lastname}
                                fullWidth
                                variant="filled"
                                label="Lastname"
                                sx={{backgroundColor: "#f1f3fa"}}
                                onChange={handleChange}
                                />
                        </InputContainer>
                        </React.Fragment>
                      )
                    }
                    <InputContainer >
                        <TextField 
                            name="username"
                            //value={authForm.username}
                            variant="filled"
                            label="Username"
                            fullWidth
                            sx={{ backgroundColor: "#f1f3fa"}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    <InputContainer >
                    <FormControl sx={{width: '100%'}}>
                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        //value={authForm.password}
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
                        //value={authForm.password}
                        onChange={handleChange}
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