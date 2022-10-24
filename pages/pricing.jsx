import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import Stripe from 'stripe'
import Layout from '../components/common/Layout'
import { usePriceContext } from '../utils/context/PriceContext'
import { BrandSpan, CenteredDiv } from '../utils/styles'
import { toast } from "react-hot-toast";
import { useRouter } from 'next/router'


const Pricing = ({fixed, free, freePrice, fixedPrice}) => {
    //TODO handle other currencies
    const {setSelectedPrice, selectedPrice, priceFormatter} = usePriceContext()
    const router = useRouter()
    
    const handleClick = (id, name) => {
        setSelectedPrice({mainPrice: id})
        localStorage.setItem('price', JSON.stringify({mainPrice: id}))
        toast.success(`${name} Option Selected!`)
        router.push('/add-ons')
    }
    
    //console.log(selectedPrice)
  return (
    <Layout title="Pricing" seo="Pricing Options">
        <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
            <Container sx={{m: "0 auto", p: "0 20px", width: "100%", boxSizing: "border-box"}} maxWidth="md">
            <CenteredDiv>
                <h1>
                   Flexible Pricing <BrandSpan>Options</BrandSpan> 
                </h1>
            </CenteredDiv>
            <CenteredDiv>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined' >
                            <CardContent>
                                <Typography variant='h3'>{fixed.name}</Typography>
                                <Typography variant='h1'> {priceFormatter(fixedPrice.unit_amount)} <Typography variant='body1' component="span">pcm</Typography></Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='contained' onClick={() => handleClick(fixed.id, fixed.name)}>
                                    Get Started
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined'>
                            <CardContent>
                                <Typography variant='h3'>{free.name}</Typography>
                                <Typography variant='h1'> %6 <Typography variant='body1' component="span">commission fee </Typography></Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='contained' onClick={() => handleClick(free.id, free.name)}>
                                    Get Started
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                </Grid>
                
            </CenteredDiv>
            </Container>

        </Box>

    </Layout>  
)}

export default Pricing

export const getStaticProps = async () => {
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = await stripe.products.list()

const free = products.data.find((x) => (x.name === "free"))
const fixed = products.data.find((x) => (x.name === "fixed"))

const freePrice = await stripe.prices.retrieve(free.default_price)
const fixedPrice = await stripe.prices.retrieve(fixed.default_price)

return {
    props:{
        fixed, free, freePrice, fixedPrice
    } 
}

}