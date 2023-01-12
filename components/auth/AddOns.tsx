import { Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Stripe from 'stripe'
import { toast } from "react-hot-toast";

import Layout from '../common/Layout'
import { usePriceContext } from '../../utils/context/PriceContext'
import { CenteredDiv, FlexStart } from '../../utils/styles'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AddOns = ({filteredProducts}) => {

    const { data: session, status } = useSession()

    const {setSelectedPrice, selectedPrice, priceFormatter} = usePriceContext()
    const [addOns, setAddOns] = useState([])
    const router = useRouter()

    const handleAuthedAddOns = async () => {
        
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
                router.push(data.url)
            }
        })
    }

    const handleNoAddOns = () => {
        localStorage.removeItem('price')
        router.push('/dashboard')
    }

    const addOnsCheck = () => {
        if(localStorage.getItem('price')) {
            const arr = JSON.parse(localStorage.getItem('price'))
            
            const objArr = filteredProducts.filter(obj => {
                return arr.some((id) => {
                    return obj.default_price === id
                })       
            })
            setAddOns(objArr)
        }
    }

    useEffect(() => {
      addOnsCheck()
    }, [])

    const handleClick = (id, name) => {
        const newArr = [...selectedPrice, id]
        setSelectedPrice(newArr)
        localStorage.setItem('price', JSON.stringify(newArr))
        toast.success(`${name} Selected!`)
        addOnsCheck()
    }
    const handleRemove = (id, name) => {
        const newArr = selectedPrice.filter(x => x !== id)
        setSelectedPrice(newArr)
        localStorage.setItem('price', JSON.stringify(newArr))
        toast.error(`${name} Removed`)
        addOnsCheck()
    }
    console.log(selectedPrice)

    return (
        <Layout title="Add ons" seo="Pricing Options - Add ons">
            <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
                <CenteredDiv>
                    {
                        filteredProducts.map((product) => (
                            <Card key={product.id}>
                                <CardContent>
                                    <Typography>{product.name}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' onClick={() => handleClick(product.default_price, product.name)}>
                                        Add
                                    </Button>
                                    
                                </CardActions>
                            </Card>
                        ))
                    }
                    
                    
                </CenteredDiv>
                <CenteredDiv>
                <Container fixed  >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FlexStart >
                    <Typography variant='h3' >Your Cart</Typography>
                    <Typography sx={{pl: 2, mt: 2, pt: '3px'}}  variant='subtitle2' gutterBottom >5</Typography> 
                </FlexStart>
                
            </Toolbar>
            <Divider />
            { addOns.length === 0  && 
                <CenteredDiv sx={{m: 10}}>
                    <Typography variant='h6' gutterBottom>No add ons selected</Typography>
                    { status === "authenticated" ? 

                        <Button
                            variant='contained'
                            onClick={handleNoAddOns}                        
                        >
                            Go back to Dashboard
                        </Button>
                    :
                        <Button
                        variant='contained'
                        href='/auth'                        
                        >
                            Continue without add ons
                        </Button>
                    }
               </CenteredDiv>
            }
            <TableContainer component={Paper} elevation={0} square sx={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
                <Table >
                    <TableBody >
                        {addOns.length >= 1 && addOns.map((obj) => (
                            <TableRow  key={obj.id}>
                                
                                <TableCell>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant='subtitle1' gutterBottom>{obj.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align='right'>£{obj.price}</Typography>
                                        </Grid>
                                       
                                        <Grid item xs={6}>
                                            <Typography align='right'>
                                                <Button
                                                    variant="text"
                                                    color="error"
                                                    sx={{padding: 0}}
                                                    onClick={() => handleRemove(obj.default_price, obj.name)}
                                                >
                                                    Remove
                                                </Button>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                        
                    </TableBody>
                </Table>
            </TableContainer>
                
            
            
                <Paper sx={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: '50px 30px' }} elevation={3}>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Subtotal: £1000</Typography>
                        </Grid>
                        {addOns.length >= 1 &&
                        <Grid item xs={6}>
                                { status === "authenticated" ? 
                                <Button
                                type="button"
                                fullWidth
                                onClick={handleAuthedAddOns}
                                variant="contained"
                                color="secondary"
                                >
                                    Add add ons to your account
                                </Button>
                                :
                                <Button
                                type="button"
                                fullWidth
                                href='/auth'
                                variant="contained"
                                color="secondary"
                                >
                                    Create Account
                                </Button>
                                }
                        </Grid>
                        }
                        

                    </Grid>
                    
                </Paper>
            
            </Container>
                </CenteredDiv>
            </Box>

        </Layout>
  )
}

export default AddOns

