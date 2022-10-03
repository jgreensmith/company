import { useContext } from "react";
import { IconButton, Button, Container, Grid, Paper, Toolbar, Typography, Divider } from "@mui/material";
import { borderTop, Box } from "@mui/system";



export default function Footer() {
   

  return (

    <Container maxWidth="100%" component="footer" 
        sx={{ 
            position: 'static',
            background: 'inherit',
            bottom: '0',
            zIndex: 10,
            height: '60px'
        }}
    >
        <Divider  />
        <Box p={4} sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box >
                <Typography variant="body2" align="left" sx={{pt: 1, color: "background.text"}}>
                    {'© '}
                    Greensmith Merchants 2022
                    {'.'}
                </Typography>
                
            </Box>
            <Box sx={{minWidth: '200px'}}>
                <Button variant="text" href='#' sx={{color: "background.text"}} >
                    Contact
                </Button>
                
                
            </Box>

        </Box>
    </Container>
  )
}