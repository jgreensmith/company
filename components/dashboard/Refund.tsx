import { Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { usePriceContext } from '../../utils/context/PriceContext'
import { CenteredDiv, FlexEnd, FlexStart, InputContainer } from '../../utils/styles'

const Refund = ({props}) => {
    const { paymentIntent, name, checked, setModalOpen } = props;
    const { priceFormatter } = usePriceContext();
    const router = useRouter()
    const [ authorise, setAuthorise ] = useState('');
    const checkedValues = checked.map((x: any) => x.amount_total)
    const totalRefund = checkedValues.reduce((a: number, b: number) => a + b, 0)

    const authoriseRefund = async () => {
        if(authorise === 'REFUND') {
            await fetch('/api/dashboard/refund', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ account: router.query.account_id, paymentIntent, totalRefund  })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    router.push('/dashboard?refund=true')
                }
            })
        }
    }

    console.log({paymentIntent})

  return (
    <Container>
        <Toolbar disableGutters >
              <FlexEnd>
                  <IconButton onClick={() => setModalOpen(false)}>
                        <AiOutlineClose />
                  </IconButton>
              </FlexEnd>
          </Toolbar>
            <FlexStart>
                <Typography variant='subtitle1' align='left' gutterBottom>Refund {priceFormatter(totalRefund)} to: {name}</Typography>
            </FlexStart>
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
                {checked.map((item: any) => (
                    <TableRow
                        key={item.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {item?.price?.product.name ? item.price.product.name : 'Shipping'}
                        </TableCell>
                        <TableCell align="right">{item?.quantity ? item.quantity : '-'}</TableCell>
                        <TableCell align="right">{priceFormatter(item.amount_total)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <CenteredDiv>
        <FlexStart>
            <Typography variant='body2' align='left' gutterBottom>{"To authorise the refund, type 'REFUND' below (case - sensitive)"} </Typography>
        </FlexStart>
        <InputContainer >
        
            <TextField 
            value={authorise}
            variant="outlined"
            fullWidth
            label="TYPE HERE"       
            sx={{backgroundColor: "#f1f3fa"}}
            onChange={(e) => setAuthorise(e.target.value)}
            />
        </InputContainer>
        <FlexStart>
            <Button onClick={authoriseRefund} disabled={authorise === 'REFUND' ? false : true} variant='text'>authorize refund</Button>
        </FlexStart>
        </CenteredDiv>
    </Container>
  )
}

export default Refund