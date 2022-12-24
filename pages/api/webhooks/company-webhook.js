import Stripe from "stripe";
import { buffer } from "micro";
import nodemailer from "nodemailer";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export const config = { api: { bodyParser: false } };


//const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_ENDPOINT_SECRET;
//CLI
const webhookSecret = 'whsec_2ad5b53f1809831bfa6d85c80d5eb6fc20d404e036efe12cbd8c07f4718b1ee3'


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
        switch (event.type ) {
            case 'customer.subscription.updated':
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
                console.log('subscription error', error);
            }  
            break;
            case 'invoice.payment_failed': 
            try {
                const customer = event.data.object.customer
                const url = 'http://localhost:3000/dashboard'
                const companyEmail = process.env.EMAIL_FROM

                await dbConnect()

                const user = await User.findOne({customerId :  customer })

                if(user) {

                let transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SERVER_HOST,
                    port: process.env.EMAIL_SERVER_PORT,
                    secure: false,
                    auth: {
                        user: companyEmail,
                        pass: process.env.EMAIL_SERVER_PASSWORD
                    },
                    tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    },
                });

                

                const mailOptions = {
                    from: companyEmail,
                    to: user.email,
                    subject: 'Payment Declined',
                    text: `Hello, Your account is on hold as we are unable to charge your card. \n
                    to continue selling, please adjust check your payment details in the dashboard \n
                     ${url} \n 
                    alternatively, you can change the account settings to the 'Free with commission' account type \n
                    kind regards, \n
                    Greensmith Merchants
                    `
                }
                let info = await transporter.sendMail(mailOptions)
                console.log('email', info.messageId)
                console.log('event', event)
                
            }
            console.log('user', user)

            } catch (error) {
                console.log({error})
            }
            break;
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
        res.send({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;