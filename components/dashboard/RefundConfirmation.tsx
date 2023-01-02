import React from 'react'
import { Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import { CenteredDiv, FlexEnd, FlexStart, InputContainer } from '../../utils/styles'
import { AiOutlineClose } from 'react-icons/ai'


const RefundConfirmation = ({handleRefundClose}) => {
    
  return (
    <Container>
        <Toolbar disableGutters >
              <FlexEnd>
                  <IconButton onClick={handleRefundClose}>
                        <AiOutlineClose />
                  </IconButton>
              </FlexEnd>
          </Toolbar>
            <FlexStart>
                <Typography variant='subtitle1' align='left' color='success' gutterBottom>Refund Succesfull</Typography>
            </FlexStart>
        
    </Container>
  )
}

export default RefundConfirmation