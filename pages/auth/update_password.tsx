import { Box, Button, Divider, Fade, FilledInput, FormControl, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Loader from '../../components/svg/Loader'
import dbConnect from '../../lib/dbConnect'
import User from '../../model/User'
import { CenteredDiv, InputContainer, FlexEnd } from '../../utils/styles'

interface UpdatePassProps {
    token: string
}

const UpdatePassword = ({token}: UpdatePassProps) => {

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [passStrColor, setPassStrColor] = useState("red")
    const [passwordStrength, setPasswordStrength] = useState("weak")
    const [error, setError] = useState(null)
    const router = useRouter()
    
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const updatePassword = async () => {
        if(confirmPassword === password) {

        await fetch('/api/update-password', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                setError(data.error)
            } else {
                router.push('/auth?pass_updated=true')           
            }
        })
        } else {
            setConfirmPasswordError(true)
        }
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

      useEffect(() => {
        passwordStrengthHandler(password)
      }, [password])

   

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePassword()
    }


  return (

<Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
           

                <CenteredDiv>
                <Typography color='black' variant='body1'>
                    Please enter your new password
                </Typography>
            </CenteredDiv>
            <Divider />
            
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <InputContainer >
                    <FormControl sx={{width: '100%'}} error={passwordStrength === "weak" ? true : false}>
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
                  
                      <FlexEnd sx={{pr: 4, pb: 1}}>
                        <Tooltip 
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }} 
                        placement="top-end"
                        title='Password should contain atleast: eight characters, one uppercase, one lowercase, one numerical digit, one special character'>
                          <div className='password-strength'><p>Password strength: <span style={{color: passStrColor}} >{passwordStrength}</span></p></div>
                        </Tooltip>
                      </FlexEnd>
                    
                    
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
                    
                    {error && <Typography variant="body1" sx={{color: 'error.main'}} >{error}</Typography>}
                    <Button  variant="contained" type="submit" fullWidth sx={{p:2}}>Update Password</Button>

                </form>
        </Box>
    </Box>  )
}

export default UpdatePassword

export async function getServerSideProps(context: any) {

    try {
                
    await dbConnect()

    // @ts-ignore
    const query = await User.findOne({hashedEmail: context.query.token})
    const user = JSON.parse(JSON.stringify(query))

    if(!user) return {notFound: true}
   
    return {
        props: {
            token: user.hashedEmail
        }
    }
} catch (error) {
    console.log(error)   
}
}

