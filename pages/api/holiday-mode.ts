import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { id, holidayBool } = req.body
           
            await dbConnect()

            // @ts-ignore
            const user = await User.findByIdAndUpdate({_id: id}, { $set:  {holidayMode: holidayBool}})

            //subscriptions
            if(user.subId) {
                await stripe.subscriptions.update(
                    user.subId,
                    {pause_collection: {behavior: 'keep_as_draft'}}
                );
            }
            res.status(200).json({message: `Holiday mode: ${holidayBool}`})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}