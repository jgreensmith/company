import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {id} = req.body
            await dbConnect()
            // @ts-ignore
            const user = await User.findById({_id: id})

            const portal = await stripe.billingPortal.sessions.create({
                customer: user.customerId,
                return_url: 'https://company-cyan.vercel.app/dashboard'
            })
            res.status(200).json(portal)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message)
        }
    }
}