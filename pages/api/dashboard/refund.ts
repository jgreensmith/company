import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"


// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { paymentIntent, account, totalRefund } = req.body

            const refund = await stripe.refunds.create({
                payment_intent: paymentIntent,
                amount: totalRefund
            },
            {stripeAccount: account})
            res.status(200).json({refund})
        } catch (error) {
            res.status(400).json({error})
        }
    }
}