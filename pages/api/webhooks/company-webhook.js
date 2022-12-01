import Stripe from "stripe"
import { buffer } from "micro";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export const config = { api: { bodyParser: false } };


const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_ENDPOINT_SECRET;
//CLI
//const webhookSecret = 'whsec_2ad5b53f1809831bfa6d85c80d5eb6fc20d404e036efe12cbd8c07f4718b1ee3'


const handler = async (req, res) => {
    if (req.method === "POST") {
        const sig = req.headers["stripe-signature"];

        const buffy = await buffer(req)


        let event;

        try {
            event = stripe.webhooks.constructEvent(buffy, sig, webhookSecret);
            console.log( 'stripeEvent', event.type );
        } catch (err) {
            console.log( 'errorrrr', err );
            res.status(400).send(`Webhook Error: ${err.message}`);

            return;
        }

        // Handle the event
        if (event.type ==='customer.subscription.updated') {
            
            const updated = event.data.object;
            //console.log(updated)
            try {
                
                await dbConnect()

                await User.findOneAndUpdate(
                    {customerId : { $eq: updated.customer }},
                    {$set: {
                        holidayMode: updated.pause_collection ? true : false,
                        canceled: updated.canceled_at ? true : false
                    }}
                )
            } catch (error) {
                console.error('subscription error', error);
            }   
        }
        res.send({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;