import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // @ts-ignore
            const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
            // @ts-ignore
            const customer = await stripe.customers.retrieve(session.customer);
            
            //const items = await stripe.checkout.sessions.listLineItems(req.query.session_id, { expand: ["data.price.product"]});

    res.status(200).json({ session, customer});
    } catch (error) {
        res.status(404).json({error})
        console.log(error);
    }
        
    }
}