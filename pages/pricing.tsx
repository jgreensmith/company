import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/common/Layout'
import { BrandSpan, CenteredDiv } from '../utils/styles'


const Pricing = () => {
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
                                <Typography variant='h3'>Fixed</Typography>
                                <Typography variant='h1'> £20 <Typography variant='body1' component="span">pcm</Typography></Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='contained'>
                                    Get Started
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined'>
                            <CardContent>
                                <Typography variant='h3'>Free</Typography>
                                <Typography variant='h1'> %6 <Typography variant='body1' component="span">commission fee </Typography></Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='contained'>
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