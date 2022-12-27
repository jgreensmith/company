import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email } = req.body
           
            await dbConnect()

            // @ts-ignore
            const user = await User.findOne({email: email})
            if(!user?.isVerified) {
              return  res.status(400).json({error: 'Please use a verified email address'})
            } else {
                const url = new URL('http://localhost:3000/update_password')

                url.searchParams.set('token', user.hashedEmail)
                const companyEmail = process.env.EMAIL_FROM


                let transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SERVER_HOST,
                    port: process.env.EMAIL_SERVER_PORT,
                    secure: false,
                    auth: {
                        user: companyEmail,
                        pass: process.env.EMAIL_SERVER_PASSWORD
                    },
                    tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    },
                });

                

                const mailOptions = {
                    from: companyEmail,
                    to: email,
                    subject: 'Update Password',
                    text: `Hello, \n
                    Please follow the link below to update your password \n
                    ${url} \n
                    kind regards, \n
                    Greensmith Merchants
                    `
                }
                let info = await transporter.sendMail(mailOptions)
                console.log('info', info)

                return res.status(200).json({message: 'email sent'})

            }


            
            //res.status(200).json(user)
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message);
        }
        
    }
}