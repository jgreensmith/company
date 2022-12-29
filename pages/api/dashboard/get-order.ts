import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  try {
    //@ts-ignore
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {stripeAccount: req.query.account_id});
    //@ts-ignore
    const items = await stripe.checkout.sessions.listLineItems(req.query.session_id, { 
      expand: ["data.price.product"],
    }, {
      stripeAccount: req.query.account_id
    }
  );

    res.status(200).json({ session, items});
  } catch (error) {
    res.status(404).json({error})
  }
  
}