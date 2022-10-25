import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {id} = req.body
            await dbConnect()
            // @ts-ignore
            const user = await User.findById({_id: id})
            const data = user.customerId

            res.status(200).json(data)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message)
        }
    }
}