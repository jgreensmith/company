import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {customerId, id, subId } = req.body
           
            //save customer ID in database
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, {
                customerId: customerId,
                subId: subId
            })
            
            res.status(200).json({message: "user added"})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}