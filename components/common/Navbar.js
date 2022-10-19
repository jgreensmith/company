import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';

import {
    AppBar,
    Avatar,
    Badge,
    Button,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Slide,
    Toolbar,
    Tooltip,
    Typography,
    useScrollTrigger
} from '@mui/material';

import { Box } from '@mui/system';
import { signIn, signOut, useSession } from 'next-auth/react';





function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}



const drawerWidth = 250;
const cartWidth = 500;

const Navbar = (props) => {

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session, status } = useSession()
    const [links, setLinks] = useState({})


    //console.log(totalQuantities);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const authLinks = {
        account: "Account",
        dashboard: "Dashboard"
    }
    const navLinks = {
        about: "About",
        portfolio: "Portfolio",
        pricing: "Pricing"

    }
    
    
   useEffect(() => {
    if(session && status === "authenticated") {
        setLinks(authLinks)
    } else {
       setLinks(navLinks)
    }
   }, [session])

    


    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {Object.keys(links).map((link) => (
                    <NextLink key={link} href={`/${link}`} >
                        <ListItemButton href={`/${link}`}>
                            <ListItemText primary={links[link]} />
                        </ListItemButton>
                    </NextLink>
                ))}
            </List>
        </div>
    );
    

    const container = window !== undefined ? () => window().document.body : undefined;
    console.log(session)

    return (
        <React.Fragment>
            <CssBaseline />
            <HideOnScroll {...props}>
                <AppBar sx={{ bgcolor: 'primary.main' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' }, color: 'primary.text' }}
                        >
                            click
                        </IconButton>
                        <div style={{width: '100%', maxWidth: '200px'}}>

                        <NextLink href="/">
                            home
                        </NextLink>
                        </div>
                        <List sx={{ display: { sm: "flex", xs: "none" }, ml: 'auto', mr: 3 }}>
                            {Object.keys(links).map((link) => (
                                <NextLink key={link} href={`/${link}`}>
                                    <ListItemButton href={`/${link}`} >
                                        <ListItemText 
                                            primary={links[link]} 
                                            disableTypography={true} 
                                            sx={{ 
                                                fontSize: '1.2rem', 
                                                color: 'primary.text',
                                                ":hover": { 
                                                    background: 'none',
                                                    color: 'secondary.main',
                                                }, 
                                            }}
                                        />
                                    </ListItemButton>
                                </NextLink>
                            ))}
                        </List>
                        {
                            status === "authenticated" ? 
                            <div>
                                { session.user.name &&
                                    <div>
                                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                                        {Array.from(session.user.name)[0]}
                                    </Avatar>
                                </div>}
                                <div>
                                    <Button color='secondary' variant='text' onClick={() => signOut({ callbackUrl: '/' })}>
                                        Log Out
                                    </Button>
                                </div>
                            </div>
                            :
                            <div>
                                <Button color='secondary' variant='contained' href='/auth'>
                                    Log in
                                </Button>
                            </div>
                        }
                        

                        </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                        disableScrollLock: true
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            
        </React.Fragment>

    )
}

export default Navbar;
