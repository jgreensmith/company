import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) { 
    if (req.method === 'POST') {
        try {
            const {email} = req.body
            const account = await stripe.accounts.create({
                type: 'standard',
                email: email
            })
            res.status(200).json(account)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}

