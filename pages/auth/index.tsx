import { NextPage } from 'next'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useSession, signIn, getProviders, signOut } from "next-auth/react";

import { Box, Button, Container, Typography, Divider, TextField, IconButton, InputAdornment, FilledInput, InputLabel, FormControl, Tooltip, Fade, Paper } from '@mui/material';
import { CenteredDiv, FlexEnd, InputContainer } from '../../utils/styles'
import { FcGoogle } from 'react-icons/fc'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Loader from '../../components/svg/Loader';
import { useRouter } from 'next/router';
import { usePriceContext } from '../../utils/context/PriceContext';
import { toast } from 'react-hot-toast';

interface IFormData {
  email: string
  password: string
}


const Auth: NextPage = () => {
    const [isNewUser, setIsNewUser] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [error, setError] = useState('')
    const [passwordStrength, setPasswordStrength] = useState("weak")
    const [passStrColor, setPassStrColor] = useState("red")
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const { selectedPrice } = usePriceContext()

    
    const [formData, setFormData] = useState<IFormData>({
      email: "",
      password: ""
    })
    
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    }

    useEffect(() => {
      // if(localStorage.getItem('price')) {
      //   setIsNewUser(false)
      // } else {
      //   setIsNewUser(true)
      // }
      if(router.query.pass_updated) {
        toast.success('Password Succesfully Updated!')
      }
    }, [])

    //if user has already been authenticated but not selected pricing options
    //now they have selected price user must go through stripe flow
    // const handleGoogleSignIn = async () => {
    //   if(localStorage.getItem('googleRerouted')) {
    //     await signIn('google', { callbackUrl: '/googleStripe' })
    //     localStorage.removeItem('googleRerouted')
    //   } else {
    //     await signIn('google', { callbackUrl: '/dashboard' })
    //   }
    // }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
      //medium strength regex is used on api validation
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

    const passwordStrengthHandler = (password: string) => {
      if(strongPassword.test(password)) {
        setPasswordStrength("Strong");
        setPassStrColor("#22dd22")
      } else if(mediumPassword.test(password)) {
        setPasswordStrength("medium");
        setPassStrColor("#FFBF00")

      } else {
        setPasswordStrength("weak");
        setPassStrColor("red")
      }
    }
    //validate password strength onChange event
    useEffect(() => {
      passwordStrengthHandler(formData.password)
    }, [formData.password])
    
   
    

    //register when using credentials then call stripe account set up
    const register = async () => {
      if(confirmPassword === formData.password) {
        const name = `${firstName} ${lastName}`
          
        await fetch('/api/register', {
          method: 'POST',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, companyName, email: formData.email, password: formData.password })
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.error) {

            setError(data.error) 
            console.log(data.error)
          } else {
            router.push(`/auth/re_enter_auth?token=${data.hashedEmail}`)            
            setLoader(true) 
          }
        });
        
      } else {
        setConfirmPasswordError(true)
      }
    }
    //login has optional prop, url from checkout after register or login normally
    const loginUser = async () => {
    
      const res: any = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard'
      })
      
      if (res.error) {
        setError(res.error)        
      } else {
        router.push(res.url)      
      }

    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      isNewUser ? register() : loginUser()
    }

  if(loader) return <Loader message="authentication successfull"/>


  return (
    <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
      {/* <CenteredDiv sx={{height: '100%', width: '100%', overflow: 'scroll', paddingTop: '20px'}}> */}
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
            <CenteredDiv>
                <Typography color='black' variant='h5'>{!isNewUser ? "Log In" : "Create an account"}</Typography>
                
                <Typography color='black' variant='body1'>
                        {isNewUser ? 'Already got an account? ' :  'Not registered yet?'}
                    
                    <Button variant='text' sx={{textTransform: 'capitalize'}} onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? 'Log in' :  'Create an account'}

                    </Button>
                </Typography>
                
            </CenteredDiv>
            <Divider />
            <CenteredDiv sx={{width: '100%', mt: 2, mb: 1, p: '0 10px'}}>
                <Button fullWidth variant='contained' startIcon={<FcGoogle />} sx={{backgroundColor: "#000000e0", p: 1}} onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
                    <Typography variant="body1" align='center' sx={{textTransform: 'capitalize', pl: 2}}>{!isNewUser ? "Log In" : "Create account"} With Google</Typography> 
                </Button>
            </CenteredDiv>
            <Divider>or</Divider>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <CenteredDiv sx={{ml: 2, mt: 2, pr: 1}}>
                    {
                      isNewUser && (
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
                        <InputContainer >
                            <TextField 
                                name="companyName"
                                value={companyName}
                                variant="filled"
                                fullWidth
                                label="Store Name"       
                                sx={{backgroundColor: "#f1f3fa"}}
                                onChange={(e) => setCompanyName(e.target.value)}
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
                    <FormControl sx={{width: '100%'}} error={passwordStrength === "weak" ? true : false}>
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
                  {isNewUser && 
                      <FlexEnd sx={{pr: 4, pb: 1}}>
                        <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }} 
                        placement="top-end"
                        title='Password should contain atleast: eight characters, one uppercase, one lowercase, one numerical digit, one special character'>
                          <div className='password-strength'><p>Password strength: <span style={{color: passStrColor}} >{passwordStrength}</span></p></div>
                        </Tooltip>
                      </FlexEnd>
                    }
                    {
                      isNewUser && (
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

                    <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>{!isNewUser ? "Log In" : "Create Account"}</Button>
                    </CenteredDiv>
                    {!isNewUser && 
                      <Typography color='black' variant='body1'>
                          
                          <Button variant='text' sx={{textTransform: 'capitalize'}} href='/auth/forgotten_password'>
                            Forgotten Password?
                          </Button>
                      </Typography>
                    }
                    </CenteredDiv>
   
                
                  </form>
        </Box>
        {/* </CenteredDiv> */}
    </Box>
  )
}

export default Auth

