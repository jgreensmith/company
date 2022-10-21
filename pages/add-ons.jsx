import { Box, Button, Card, CardActions, CardContent } from '@mui/material'
import React from 'react'
import Stripe from 'stripe'
import Layout from '../components/common/Layout'
import { usePriceContext } from '../utils/context/PriceContext'
import { CenteredDiv } from '../utils/styles'

const AddOns = ({filteredProducts, prices}) => {

    const {setSelectedPrice, selectedPrice, priceFormatter} = usePriceContext()


    const handleClick = () => {
        
    }
    console.log(filteredProducts)
    return (
        <Layout title="Add ons" seo="Pricing Options - Add ons">
            <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
                <CenteredDiv>
                    <Card>
                        <CardContent>
                            add custom domain £12
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' onClick={handleClick}>
                                Add
                            </Button>
                        </CardActions>
                    </Card>
                    <Card>
                        <CardContent>
                            add professional content writing £50
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' onClick={handleClick}>
                                Add
                            </Button>
                        </CardActions>
                    </Card>
                </CenteredDiv>
            </Box>

        </Layout>
  )
}

export default AddOns

export const getStaticProps = async () => {
    // @ts-ignore
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const products = await stripe.products.list()
    
    const filteredProducts = products.data.filter(obj => obj.name !== "fixed" && obj.name !== "free" )
    
    const prices = await stripe.prices.list()
    
    return {
        props:{
            filteredProducts, prices
        } 
    }
    
}