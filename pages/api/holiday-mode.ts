import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { id, holidayBool } = req.body
           
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, { $set:  {holidayMode: holidayBool}})
            
            res.status(200).json({message: `Holiday mode: ${holidayBool}`})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}