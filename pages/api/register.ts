import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";
import bcrypt from "bcrypt"; 
import Stripe from "stripe"
import mongoose, { FilterQuery, HydratedDocument } from "mongoose";

interface ResponseData {
    error?: string;
    msg?: string;
  }
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



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
    email: string,
    password: string
  ) => {

    if(name.length < 2) {
      return { error: "Please enter your name" }
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
    const { name, email, password } = req.body

            
    const errorMessage = await validateForm( name, email, password);
    if (errorMessage) {
        return res.status(400).json(errorMessage as ResponseData);
    }

     // hash password auto gen salt
    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await stripe.customers.create({
      email: email
    })
    const customerId = customer.id

    //create subscription
    const prices = JSON.parse(localStorage.getItem('price'))

    await stripe.subscriptions.create({
      customer: customer.id,
      items: prices
    })

    // create new User on MongoDB
    const newUser = new User({
        name,
        email,
        hashedPassword,
        customerId
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