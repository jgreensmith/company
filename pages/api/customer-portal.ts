import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const portal = await stripe.billingPortal.sessions.create({
                customer: 'cus_MdTyjSVNHou1gf',
                return_url: '/account'
            })
        } catch (error) {
            
        }
    }
}