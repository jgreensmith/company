import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {companyName, id } = req.body
           
            //save customer ID in database
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, {
                companyName: companyName
            })
            
            res.status(200).json({message: "Store name added"})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}