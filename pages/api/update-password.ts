import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

const validatePassword = (password: string): boolean => {
    //const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

  return mediumPassword.test(password);
}


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { token, password } = req.body
           
            await dbConnect()

            // @ts-ignore
            const user = await User.findOne({hashedEmail: token})
            if(!user.isVerified) {
              return  res.status(400).json({error: 'Please use a verified email address'})
            } 
            if (!validatePassword(password)) {
                return res.status(400).json({ error: "Weak password. Must adhere to password specifications" });
            }

            const hp = await bcrypt.hash(password, 12);

            // @ts-ignore
            await User.findOneAndUpdate({hashedEmail: token}, {hashedPassword: hp})

            

            return res.status(200).json({message: 'Password Succesfully Updated'})

            


            
            //res.status(200).json(user)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}