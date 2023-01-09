## Nextjs e-ccommerce website builder (dashboard)

This repo is the part of the website builder that a buisness owner would sign up to, and manage there orders, payments and their account. the dashboard is fully integrated with Stripe.

## Next-auth

The project uses next-auth to provide authentication with either google Oauth or credentials. bcrypt is used to hash the passwords either authentication method stores data, including hashed passwords, in mongoDb which is accessed by the other parts of the website builder.

## stripe webhooks

the project listens to either development or production webhooks to add orders, pause/cancel account or send emails.

## nodemailer

nodemailer is used to send automatic emails for order confirmations, subscription failed payments, email verification, forgotten password.
