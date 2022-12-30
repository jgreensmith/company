import { Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { usePriceContext } from '../utils/context/PriceContext'

import { FlexEnd, FlexStart } from '../utils/styles'

const OrderDetails = ({props}) => {

    const {order, setModalOpen} = props
    const { priceFormatter } = usePriceContext()

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
                        <TableCell align="right">{priceFormatter(item.price.unit_amount / 100)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <hr />

        {/* <Container sx={{p: 2}}>
            <FlexEnd>

                <Typography variant='subtitle1' > Subtotal: {priceFormatter.format(parseFloat(order.session.amount_subtotal / 100).toFixed(2))}</Typography>
            </FlexEnd>
            <FlexEnd>

                <Typography variant='subtitle1' align='left'> Shipping: {priceFormatter.format(parseFloat(order.session.total_details.amount_shipping / 100).toFixed(2))}</Typography>
            </FlexEnd>
            <FlexEnd>

                <Typography variant='subtitle1' align='left'> Taxes: {priceFormatter.format(parseFloat(order.session.total_details.amount_tax / 100).toFixed(2))}</Typography>
            </FlexEnd>
            <FlexEnd>
              <Typography variant='h6' align='left'> Total: {priceFormatter.format(parseFloat(order.session.amount_total / 100).toFixed(2))}</Typography>

            </FlexEnd>
        </Container>
        
                          
                           */}
        


        </Container>
  )
}

export default OrderDetails