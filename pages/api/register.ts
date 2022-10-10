import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";
import bcrypt from "bcrypt"; 
import mongoose, { FilterQuery, HydratedDocument } from "mongoose";

interface ResponseData {
    error?: string;
    msg?: string;
  }


const validateEmail = (email: string): boolean => {
    const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
}
const validatePassword = (password: string): boolean => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
  return regEx.test(password);
}
const validateForm = async (
    email: string,
    password: string
  ) => {
    
    if (!validateEmail(email)) {
      return { error: "Email is invalid" };
    }
  
    await dbConnect();
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
    const { name, email, password } = req.body

            
    const errorMessage = await validateForm( email, password);
    if (errorMessage) {
        return res.status(400).json(errorMessage as ResponseData);
    }

     // hash password auto gen salt
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new User on MongoDB
    const newUser = new User({
        name,
        email,
        hashedPassword,
    });
        
    newUser
    .save()
    .then(() =>
      res.status(200).json({ msg: "Successfuly created new User: " + newUser })
    )
    .catch((err: string) =>
      res.status(400).json({ error: "Error on '/api/register': " + err })
    );
    
}