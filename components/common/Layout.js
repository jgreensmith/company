import { Container, createTheme, CssBaseline, ThemeProvider, Toolbar } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import Navbar from './Navbar'

const Layout = ({title, seo, children}) => {

      const theme = createTheme({
        typography: {
          h1: {
            fontSize: '2.2rem',
            fontWeight: 400,
            margin: '2rem 0',
          },
          h2: {
            fontSize: '1.8rem',
            fontWeight: 400,
            margin: '1rem 0',
          },
          h3: {
            fontSize: '1.4rem',
            fontWeight: 400,
            margin: '1rem 0',
          },
        },
        palette: {
            primary: {
              main: "#d4c3e9",
              text: "#000000"
            },
            secondary: {
              main: "#28c3d1",
              text: '#000000'
            },
            error: {
              main: '#f04000',
            },
            background: {
              default: "#f1f3fa",
              text: "#000000"
            },
            text: {
              dark: "#000000",
              light: "#ffffff"  
            }
          },
  
        breakpoints: {
          values: {
            xs: 0,
            vs: 500,
            sm: 680,
            md: 920,
            lg: 1200,
            xl: 1536,
          },
        },
        
      });

  return (
    <React.Fragment>
    <Head>
      <meta charSet="utf-8" />
      <title>{`Greensmith Merchants | ${title}`}</title>
      <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="title" property="og:title" content={`Greensmith Merchants - ${title}`} />
      <meta name="description" property="og:description" content={seo} />
    </Head>
    <ThemeProvider theme={theme}>


        <CssBaseline />

        <Navbar  />
        <Container maxWidth="100%" disableGutters={true} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
            <Toolbar />

                {children}

        </Container >
    </ThemeProvider>

</React.Fragment>
  )
}

export default Layout