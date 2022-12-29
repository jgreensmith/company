import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { id } = req.body
           
            //save customer ID in database
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, {
                customerId: null,
                canceled: false,
                holidayMode: false,
            })
            
            res.status(200).json({message: "changed to free"})
        } catch (error) {
            res.status(404).json({error});
        }
        
    }
}