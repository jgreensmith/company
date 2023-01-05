import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const account = req.query.account.toString()
            const date = Number(req.query.date)

            const payouts = await stripe.payouts.list({arrival_date : {
                lt: date
            }}, {stripeAccount: account})
            
            res.status(200).json( {payouts});
        } catch (error) {
            res.status(404).json({error})
        }
        
    }
}