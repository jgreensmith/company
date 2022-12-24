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


//const webhookSecret = process.env.NEXT_PUBLIC_CONNECTED_STRIPE_WEBHOOK_ENDPOINT_SECRET;
//stripe CLI
const webhookSecret ='whsec_2ad5b53f1809831bfa6d85c80d5eb6fc20d404e036efe12cbd8c07f4718b1ee3'


const handler = async (req, res) => {
    if (req.method === "POST") {
        const sig = req.headers["stripe-signature"];

        const buffy = await buffer(req)


        let stripeEvent;

        try {
            stripeEvent = stripe.webhooks.constructEvent(buffy, sig, webhookSecret);
            //console.log( 'stripeEvent', stripeEvent );
        } catch (err) {
            //console.log( 'errorrrr', err );
            res.status(400).send(`Webhook Error: ${err.message}`);

            return;
        }

        if ( 'checkout.session.completed' === stripeEvent.type ) {
            const session = stripeEvent.data.object;
            const account = stripeEvent.account
            const items = await stripe.checkout.sessions.listLineItems(session.id, { 
                expand: ["data.price.product"]
            }, {
                stripeAccount: account  
            });
            const cusAdd = session.customer_details.address;
            const shipAdd = session.shipping_details.address;
            const companyEmail = process.env.EMAIL_FROM
            try {
            
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

            await dbConnect()

            const store = await User.findOne({connectedAccount :  account })

            const orderConf = Math.floor(Math.random() * 100000000)

            let url = new URL(`http://localhost:3001/merchants/${store.pid}/add_reviews`)

            url.searchParams.set('session_id', session.id)

            url.searchParams.set('connect_id', account)



            //TODO add store name to mongodb

            const mailOptions = {
                from: companyEmail,
                to: session.customer_details.email,
                subject: `Order Confirmation ${store.companyName}`,
                text: `thankyou for buying from ${store.companyName}, your order confirmation is: #${orderConf} \n
                please feel free to leave a review \n
                ${url}`,
                html:`<h2>thankyou for buying from ${store.companyName}, your order confirmation is: #${orderConf} <h2>\n
                <h6>please feel free to leave a review ${url}<h6>`
            }
            
            let info = await transporter.sendMail(mailOptions)

            console.log('email', info.messageId)

            
                console.log( 'sessionsession', session );
                //console.dir(items.data[0].price.product)
                await dbConnect()

                await User.findOneAndUpdate(
                    {connectedAccount :  account },
                    {$push: {orders: {
                        customerDetails: {
                            address: {
                              city: cusAdd.city,
                              country: cusAdd.country,
                              line1: cusAdd.line1,
                              line2: cusAdd.line2,
                              postal_code: cusAdd.postal_code,
                              
                            },
                            email: session.customer_details.email,
                            name: session.customer_details.name
                        },
                        shippingDetails: {
                            address: {
                              city: shipAdd.city,
                              country: shipAdd.country,
                              line1: shipAdd.line1,
                              line2: shipAdd.line2,
                              postal_code: shipAdd.postal_code,
                            },
                            name: session.shipping_details.name
                        },
                        status: session.payment_status,
                        items: items.data.map((item) => {
                            const product = item.price.product
                            return {
                                price: item.price.unit_amount,
                                id: product.id,
                                name: product.name,
                                description: product.description
                            }
                        })
                    }}}
                )
            } catch (error) {
                //await updateOrder( 'failed', session.metadata.orderId );
                console.error('Update order error', error);
            }
        } 

        res.send({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;