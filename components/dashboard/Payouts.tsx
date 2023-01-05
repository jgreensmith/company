import { Container, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, IconButton, TableFooter, Button } from '@mui/material'
import React, { useState } from 'react'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { usePriceContext } from '../../utils/context/PriceContext'
import Loader from '../svg/Loader'
import Payout from './Payout'

const Payouts = ({props}) => {
    const { payouts, account } = props
    const { priceFormatter, stripeDate } = usePriceContext()
    const [modalOpen, setModalOpen] = useState(false)
    const [payout, setPayout] = useState(null)
    const [loader, setLoader] = useState(false)
    const [payoutsData, setPayoutsData] = useState(payouts.data)
    const statusColor = (status: string) => {
        if(status === "paid") {
            return 'green'
        } else if (status === "pending") {
            return 'yellow'
        } else if (status === "in_transit") {
            return 'yellow'
        } else {
            return 'red'
        }
    }

    const handleClick = (payout: any) => {
        setModalOpen(true)
        setPayout(payout)
    }
   
    const handlePageChange = async () => {
        setLoader(true)
        const date = payoutsData[9].arrival_date
        
        await fetch(`/api/dashboard/payouts?account=${account.id}&date=${date}`, {
            method: 'GET'
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                console.log(data.error)
            } else {
                setPayoutsData(data.payouts.data)
                setLoader(false)
            }
        })
    }

    console.log({payoutsData})

    if(loader) return <Loader message='Loading Payouts' />

  return (
    <Container>
        <TableContainer component={Paper} >
            <Table sx={{ minWidth: { vs: 450 } }} >
                <TableHead>
                    <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Arrival Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {payoutsData.map((p: any) => (
                    <TableRow
                        hover
                        onClick={() => handleClick(p)}
                        key={p.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {priceFormatter(p.amount)}
                        </TableCell>
                        <TableCell align="right">
                            <span style={{ backgroundColor: statusColor(p.status)}}>
                                {p.status}
                            </span>
                        </TableCell>
                        <TableCell align="right">{stripeDate(p.arrival_date)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter >

                <TableRow  >
                    <TableCell sx={{width: '100%', pr: 0}} align='right'>
                        <Button disabled={payoutsData === payouts.data ? true : false}  onClick={() => setPayoutsData(payouts.data)}>Current</Button>

                        <Button onClick={handlePageChange}>See older</Button>
                    </TableCell>
                </TableRow>
                </TableFooter>
            </Table>

        </TableContainer>
        <Dialog
        open={modalOpen}
        fullScreen
        onClose={() => setModalOpen(false)}
        >
          <Payout props={{ setModalOpen, account: account.external_accounts.data[0], payout, statusColor}} />
        </Dialog> 
    </Container>
  )
}

export default Payouts