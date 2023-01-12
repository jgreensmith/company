import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RefundConfirmation from '@/components/dashboard/RefundConfirmation'


describe('AddOns', () => {
    it('renders a heading', () => {
        const mockHandler = jest.fn()
      render(<RefundConfirmation handleRefundClose={mockHandler} />)
  
      const heading = screen.getByRole('heading')
  
      expect(heading).toHaveTextContent('Refund Succesfull')
    })

    
  })