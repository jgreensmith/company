import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import AddOns from '@/components/auth/AddOns'

describe('AddOns', () => {
    it('renders a heading', () => {
        const arr = []
      render(<AddOns filteredProducts={arr} />)
  
    //   const heading = screen.getByRole('heading')
  
    //   expect(heading).toHaveTextContent('Your Cart')
    })
  })