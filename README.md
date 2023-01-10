## Nextjs e-commerce website builder (dashboard)

This repo is the part of the website builder that a buisness owner would sign up to, and manage there orders, payments and their account. the dashboard is fully integrated with Stripe. The dashboard uses react-modals to show requested Stripe data, and `scrollIntoView()` to scroll to specific data tables.

<img width="534" alt="Screenshot 2023-01-09 at 23 02 04" src="https://user-images.githubusercontent.com/71337767/211425623-ea4e20f7-c51c-403f-8e0a-6c430aff95f4.png">

## Next-auth

The project uses next-auth to provide authentication with either google Oauth or credentials. bcrypt is used to hash the passwords either authentication method stores data, including hashed passwords, in mongoDb which is accessed by the other parts of the website builder.

<img width="1414" alt="Screenshot 2023-01-09 at 22 35 48" src="https://user-images.githubusercontent.com/71337767/211422045-a6329380-1064-4714-bfd3-fceb1038d569.png">

## stripe webhooks

the project listens to either development or production webhooks to add orders, pause/cancel account or send emails.

## nodemailer

nodemailer is used to send automatic emails for order confirmations, subscription failed payments, email verification, forgotten password.
