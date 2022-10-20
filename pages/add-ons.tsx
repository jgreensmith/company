import { Box, Button, Card, CardActions, CardContent } from '@mui/material'
import React from 'react'
import Layout from '../components/common/Layout'
import { CenteredDiv } from '../utils/styles'

const AddOns = () => {
    const handleClick = () => {

    }

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
                </CenteredDiv>
            </Box>

        </Layout>
  )
}

export default AddOns