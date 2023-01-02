import { Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { usePriceContext } from '../utils/context/PriceContext'

import { FlexEnd, FlexStart } from '../utils/styles'
import Loader from './svg/Loader'

const OrderDetails = ({props}) => {

    const {order, setModalOpen, refundHandler} = props
    const { priceFormatter } = usePriceContext()

    if(!order) return <Loader message='fetching order data' />

    return (
    <Container  >
          <Toolbar disableGutters >
              <FlexEnd>
                  <IconButton onClick={() => setModalOpen(false)}>
                        <AiOutlineClose />
                  </IconButton>
              </FlexEnd>
          </Toolbar>

        <Container sx={{pl: 2, mb: 2}}>
            <FlexStart>
                <Typography variant='subtitle1' align='left' gutterBottom>Shipping Address</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1'>{order.session.shipping_details.name},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1'>{order.session.shipping_details.address.line1},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1'>{order.session.shipping_details.address.city},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1'>{order.session.shipping_details.address.state}</Typography>
            </FlexStart>     
            <FlexStart>
                <Typography variant='body1'>{order.session.shipping_details.address.postal_code}</Typography>
            </FlexStart>    
        </Container>
        <hr />
        <TableContainer >
            <Table sx={{ minWidth: { vs: 450 } }} >
                <TableHead>
                    <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {order.items.data.map((item) => (
                    <TableRow
                        key={item.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {item.price.product.name}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{priceFormatter(item.price.unit_amount)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <hr />

        <Container sx={{p: 2}}>
            <FlexEnd>

                <Typography variant='subtitle1' > Subtotal: {priceFormatter(order.session.amount_subtotal)}</Typography>
            </FlexEnd>
            <FlexEnd>

                <Typography variant='subtitle1' align='left'> Shipping: {priceFormatter(order.session.total_details.amount_shipping)}</Typography>
            </FlexEnd>
            <FlexEnd>

                <Typography variant='subtitle1' align='left'> Taxes: {priceFormatter(order.session.total_details.amount_tax)}</Typography>
            </FlexEnd>
            <FlexEnd>
              <Typography variant='h6' align='left'> Total: {priceFormatter(order.session.amount_total)}</Typography>

            </FlexEnd>
            <FlexStart>
                <Button onClick={() => refundHandler(order.session.id)} variant='text' color='error'>authorize refund</Button>
            </FlexStart>
        </Container>
        
                          
                          
        


        </Container>
  )
}

export default OrderDetails