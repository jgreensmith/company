import { createTheme, styled } from '@mui/material/styles';


export const CenteredDiv = styled('div')({
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column'
  });
  export const BrandSpan = styled('span')(({theme}) => ({
    color: theme.palette.primary.main
  }))

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
  export const FlexStart = styled('div')({
    display: 'flex', 
    justifyContent: 'start'
  });
  export const FlexBetween = styled('div')({
    display: 'flex', 
    justifyContent: 'space-between'
  });