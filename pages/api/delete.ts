import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import clientPromise from "../../lib/mongodb";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { id, email } = req.body

            if(email.includes('gmail')) {
                const client = await clientPromise;

                await client.db('test').collection('accounts').findOneAndDelete({_id: {$eq: id}})
            }
           
            //save customer ID in database
            await dbConnect()

            // @ts-ignore
            await User.findByIdAndDelete({_id: id})
            
            res.status(200).json({message: "user deleted"})
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}