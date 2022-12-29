import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";



export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            await dbConnect()

            //@ts-ignore
            const user = await User.findById({_id: req.query.id})

            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({error})
        }
        
    }
}