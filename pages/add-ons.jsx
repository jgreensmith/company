import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'
import Stripe from 'stripe'
import { toast } from "react-hot-toast";

import Layout from '../components/common/Layout'
import { usePriceContext } from '../utils/context/PriceContext'
import { CenteredDiv } from '../utils/styles'

const AddOns = ({filteredProducts, prices}) => {

    const {setSelectedPrice, selectedPrice, priceFormatter} = usePriceContext()

    const reduceName = (name) => {
        const reducedName = name.replaceAll(" ", "_").toLowerCase()
        return reducedName
    }


    const handleClick = (id, name) => {
        setSelectedPrice({
            ...selectedPrice,
            [reduceName(name)]: id
        })
        toast.success(`${name} Selected!`)

    }
    const handleRemove = (name) => {
        delete selectedPrice[reduceName(name)]
        toast.error(`${name} Removed`)
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
                                    <Button variant='contained' onClick={() => handleClick(product.id, product.name)}>
                                        Add
                                    </Button>
                                    <Button variant='contained' onClick={() => handleRemove(product.name)}>
                                        Remove 
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    }
                    
                    
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