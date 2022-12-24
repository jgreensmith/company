import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";


interface ResponseData {
    error?: string;
    hashedEmail?: string;
  }


const validateEmail = (email: string): boolean => {
    const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
}
const validatePassword = (password: string): boolean => {
    //const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

  return mediumPassword.test(password);
}
const validateForm = async (
    name: string,
    companyName: string,
    email: string,
    password: string
  ) => {

    if(name.length < 2) {
      return { error: "Please enter your name" }
    }
    if(companyName.length < 2) {
      return { error: "Please enter your store name" }
    }
    
    if (!validateEmail(email)) {
      return { error: "Please enter a valid email address" };
    }
  
    await dbConnect();
    // @ts-ignore
    const emailUser = await User.findOne({ email: email });
  
    if (emailUser) {
      return { error: "Email already exists" };
    }
  
    if (!validatePassword(password)) {
      return { error: "Weak password. Must adhere to password specifications" };
    }
  
    return null;
  };


export default async function handler( req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    
 // validate if it is a POST
    if (req.method !== "POST") {
    return res
        .status(200)
        .json({ error: "This API call only accepts POST methods" });
    }           
    const { name, companyName, email, password } = req.body

            
    const errorMessage = await validateForm( name, companyName, email, password);
    if (errorMessage) {
        return res.status(400).json(errorMessage as ResponseData);
    }

     // hash password auto gen salt
    const hashedPassword = await bcrypt.hash(password, 12);

    const hashedEmail = await bcrypt.hash(email, 12);

    const url = new URL('http://localhost:3000/verify_email')

    url.searchParams.set('token', hashedEmail)
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
        subject: 'Verify Email',
        text: `Hello, \n
        Please follow the link below to verify your email \n
          ${url} \n
        kind regards, \n
        Greensmith Merchants
        `
    }
    let info = await transporter.sendMail(mailOptions)
    console.log('email', info.messageId)


    // create new User on MongoDB
    const newUser = new User({
        name,
        companyName,
        email,
        hashedEmail,
        hashedPassword
    });
        
    newUser
    .save()
    .then(() =>
      res.status(200).json({hashedEmail})
    )
    .catch((err: string) =>
      res.status(400).json({ error: "Error on '/api/register': " + err })
    );
    
}