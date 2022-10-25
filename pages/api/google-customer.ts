import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {email, id, priceList } = req.body
            const prices = JSON.parse(localStorage.getItem('price'))
            //create customer
            const customer = await stripe.customers.create({
                email: email
            })
            //create customer subscription to GreensmithMerchants
            await stripe.subscriptions.create({
                customer: customer.id,
                items: prices
            })
            //save customer ID in database
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, {customerId: customer.id})
            
            res.status(200).json({message: "created customer"})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}