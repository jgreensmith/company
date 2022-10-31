import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {priceList} = req.body
            
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: priceList.map((priceId: string) => {
                    return {price: priceId, quantity: 1}
                }),
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${req.headers.origin}/cancelled`,
            
            })

            res.status(200).json(session)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}