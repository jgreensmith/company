import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


interface ResponseData {
    error?: string;
}

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
let session: object

export default async function handler( req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'POST') {
        try {
            const {priceList} = req.body
            //let prices = priceList
            const priceOption = priceList[0]
            

            if  (priceOption === "price_1LvH0PJlND9FCfnv12qQYH1P") {
                // @ts-ignore
                session = await stripe.checkout.sessions.create({
                    line_items: priceList.map((priceId: string) => {
                        return {price: priceId, quantity: 1}
                    }),
                    cancel_url: `${req.headers.origin}/cancelled`,
                    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    mode: 'subscription',
                })
            } else if (priceOption === "free_with_commission") {

                priceList.shift()
                    
                // @ts-ignore
                session = await stripe.checkout.sessions.create({
                    line_items: priceList.map((priceId: string) => {
                        return {price: priceId, quantity: 1}
                    }),
                    cancel_url: `${req.headers.origin}/cancelled`,
                    success_url: `${req.headers.origin}/noCustomerSuccess`,
                    mode: 'payment'
                })
                
                
                
            } else {
                return res.status(400).json("not a valid price id" as ResponseData);
            }
            
           

            res.status(200).json(session)
        } catch (err) {
            res.status(400).json({ error: "Error on '/api/checkout': " + err });
        }
        
    }
}