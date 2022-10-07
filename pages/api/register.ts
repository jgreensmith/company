import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../utils/User";
import bcrypt from "bcrypt"; 

// interface ResponseData {
//     error?: string;
//     msg?: string;
//   }

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    try {
        await dbConnect()
        res.status(200).json({message: 'mongodb connected, welldone big boy'})
    } catch (error) {
        res.status(400).json({error: 'failed to connect to mongodb you useless bag of shit. you suck'})
    }
}