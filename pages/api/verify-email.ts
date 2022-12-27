import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { token } = req.body
           
            await dbConnect()

            // @ts-ignore
            const user = await User.findOneAndUpdate({hashedEmail: token}, {isVerified: true})
            
            res.status(200).json(user.isVerified)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}