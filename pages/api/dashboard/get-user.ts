import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            await dbConnect()

            //@ts-ignore
            const user = await User.findById({_id: req.query.id})

            const balance = await stripe.balance.retrieve({stripeAccount: user.connectedAccount})

            const payouts = await stripe.payouts.list({stripeAccount: user.connectedAccount})

            const account = await stripe.accounts.retrieve( user.connectedAccount)

            res.status(200).json({user, balance, payouts, account});
        } catch (error) {
            res.status(404).json({error})
        }
        
    }
}