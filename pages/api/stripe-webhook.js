import Stripe from "stripe"
import { buffer } from "micro";

import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export const config = { api: { bodyParser: false } };


//const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
//stripe CLI
const webhookSecret ='whsec_2ad5b53f1809831bfa6d85c80d5eb6fc20d404e036efe12cbd8c07f4718b1ee3'


const handler = async (req, res) => {
    if (req.method === "POST") {
        const sig = req.headers["stripe-signature"];

        const buffy = await buffer(req)


        let stripeEvent;

        try {
            stripeEvent = stripe.webhooks.constructEvent(buffy, sig, webhookSecret);
            console.log( 'stripeEvent', stripeEvent );
        } catch (err) {
            console.log( 'errorrrr', err );
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

            
            try {
                console.log( 'sessionsession', session );
                console.dir(items.data[0].price.product)
                await dbConnect()

                await User.findOneAndUpdate(
                    {connectedAccount : { $eq: account }},
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