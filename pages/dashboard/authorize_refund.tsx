import { Box, Button, Checkbox, Container, Dialog, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Refund from '../../components/dashboard/Refund'
import Loader from '../../components/svg/Loader'
import { FlexBetween, FlexStart } from '../../utils/styles'

const AuthorizeRefund = () => {
    const { data: session, status } = useSession({required: true})
    const router = useRouter()
    const [checked, setChecked] = useState([]);
    const [shippingChecked, setShippingChecked] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [orderData, setOrderData] = useState(null);
    const shipping = {id: 'shipping', amount_total: orderData?.session.total_details.amount_shipping}

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };

    const handleShippingToggle = (e, value) => {
        setShippingChecked(e.target.checked)
        if(e.target.checked) {
            setChecked([...checked, value])
        } else {
            const newArr = checked.filter(x => x.id !== value.id)
            setChecked(newArr)
        }
    }

    const fetchOrder = async () => {
        await fetch(`/api/dashboard/get-order?session_id=${router.query.session_id}&account_id=${router.query.account_id}`, {
            method: 'GET'
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.error) {
            console.log(data.error)
          } else {
            setOrderData(data)
          }
        })
    }

    useEffect(() => {
        if(status === "authenticated") {
            fetchOrder()
        }
    }, [session])

    console.log(checked)
    console.log(orderData)


    if(!orderData) return <Loader message='fetching order data' />

  return (
    <Box className='background' sx={{backgroundImage: "url('/blurry-gradient-haikei.svg')"}}>
        <Box className='auth' sx={{width: {xs: '80%', sm: '420px'}}}>
        <Container sx={{pl: 2, mb: 2}}>
            <FlexStart>
                <Typography variant='subtitle1' align='left' gutterBottom>Refund to: </Typography>
            </FlexStart>
            <FlexStart >
                <Typography variant='body1' align='right'>{orderData.session.customer_details.name},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1' align='right'>{orderData.session.customer_details.address.line1},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1' align='right'>{orderData.session.customer_details.address.city},</Typography>
            </FlexStart>
            <FlexStart>
                <Typography variant='body1' align='right'>{orderData.session.customer_details.address.state}</Typography>
            </FlexStart>     
            <FlexStart>
                <Typography variant='body1' align='right'>{orderData.session.customer_details.address.postal_code}</Typography>
            </FlexStart>    
        </Container>

        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {orderData.items.data.map((item: any, i) => {
        const labelId = `checkbox-list-secondary-label-${item.id}`;
        return (
          <ListItem
            key={item}
            
          >
            <ListItemButton role={undefined} onClick={handleToggle(item)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
            <Typography variant='body2'>{item.price.product.name}</Typography>
            <Typography variant='body2'>{item.price.unit_amount}</Typography>
            </ListItemButton>
          </ListItem>
        );
      })}
      <ListItem  >
            <ListItemButton role={undefined} onClick={(e) => handleShippingToggle(e, shipping)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={shippingChecked}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
            <Typography variant='body2'>Shipping</Typography>
            <Typography variant='body2'>{orderData.session.total_details.amount_shipping}</Typography>
            </ListItemButton>
          </ListItem>
      
    </List>
    <FlexBetween >
    <Button variant='text' color='error' href='/dashboard' >
      cancel refund
    </Button>
    <Button onClick={() => setModalOpen(true)}  >
      review refund
    </Button>
    </FlexBetween>

            </Box>
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            
              >
                
                <Refund props={{ paymentIntent: orderData.session.payment_intent, name: orderData.session.shipping_details.name, checked, setModalOpen }} />
              </Dialog> 
            </Box>
  )
}

export default AuthorizeRefund