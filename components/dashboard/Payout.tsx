import { Container, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { usePriceContext } from '../../utils/context/PriceContext'
import { FlexEnd, FlexStart } from '../../utils/styles'

const Payout = ({props}) => {
    const { setModalOpen, account, payout, statusColor } = props
    const { priceFormatter, stripeDate } = usePriceContext()

  return (
    <Container>
        <Toolbar disableGutters >
            <FlexStart>
                <Typography variant='subtitle1'>
                    Payout
                </Typography>
            </FlexStart>
            <FlexEnd>
                <IconButton onClick={() => setModalOpen(false)}>
                    <AiOutlineClose />
                </IconButton>
            </FlexEnd>
        </Toolbar>
        <hr/>
        <FlexStart >
            <Typography variant='h2'>
                {priceFormatter(payout.amount)}
            </Typography>
            <Typography variant='body1' sx={{color: statusColor(payout.status)}}>
                {payout.status}
            </Typography>
        </FlexStart>
        <FlexStart sx={{flexDirection: 'column'}}>

            <Typography variant='subtitle1'>
                Date initiated: {stripeDate(payout.created)}
            </Typography>
            <Typography variant='subtitle1'>
                Date arrived: {stripeDate(payout.arrival_date)}
            </Typography>
            <Typography variant='subtitle1'>
                Description: {payout.description}
            </Typography>
            <Typography variant='subtitle1'>
                Payout ID: {payout.id}
            </Typography>
            <Typography variant='subtitle1'>
                Delivery method: {payout.method}
            </Typography>
            { payout.failure_balance_transaction &&  <Typography sx={{backgroundColor: 'red'}} variant='subtitle1'>
                FAILURE BALANCE TRANSACTION: {payout.failure_balance_transaction}
            </Typography>}
            { payout.failure_code && <Typography sx={{backgroundColor: 'red'}} variant='subtitle1'>
                FAILURE CODE: {payout.failure_code}
            </Typography>}
            { payout.failure_message && <Typography sx={{backgroundColor: 'red'}} variant='subtitle1'>
               FAILURE MESSAGE: {payout.failure_message}
            </Typography>}
            
        </FlexStart>
        <Typography variant='h3'>
                Account
            </Typography>
            <hr />
        <FlexStart sx={{flexDirection: 'column'}} >
            <Typography variant='subtitle1'>
                Bank name: {account.bank_name}
            </Typography>
            <Typography variant='subtitle1'>
                type: {account.object}
            </Typography>
            <Typography variant='subtitle1'>
                Country: {account.country}
            </Typography>
            <Typography variant='subtitle1'>
                Card Number: #### #### #### {account.last4}
            </Typography>
        </FlexStart>
    </Container>
  )
}

export default Payout