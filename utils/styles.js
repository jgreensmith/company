import { createTheme, styled } from '@mui/material/styles';


export const CenteredDiv = styled('div')({
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column'
  });

  export const InputContainer = styled('div')({
    paddingRight: '10px',
    paddingBottom: '10px',
    width: '100%'
  });
  export const FlexEnd = styled('div')({
    display: 'flex',
    justifyContent: 'end',
    paddingRight: 2,
    width: '100%'
  });