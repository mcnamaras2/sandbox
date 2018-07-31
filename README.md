# Technology Sandbox Printer Queue
An online print queue for technology sandbox 3d printers

# Motivation
- make it easy for Technology Sandbox Staff to schedule and edit 3D printing appointments.
- make it easy to track printer usage

# Technology used
- https://firebase.google.com/ for data storage and hosting
- https://fullcalendar.io/ for UI
- https://momentjs.com/ for dates and times

# Firebase Details
following the pattern described here https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html there are two identical firebase projects representing two environments, one for development and one for production. You can test interface changes by deploying to dev.

- tech-sandbox-print-queue-dev
- tech-sandbox-print-queue-prod

<<<<<<< HEAD
=======

>>>>>>> cec4ebf302d77a880b163a313281cc9db1d2db8c
NOTE: currently the dev project points interacts with the production database, so be careful when testing in the dev project, your changes are live.

# Usage

## Adding new Printers
https://fullcalendar.io/docs/resources-array

## Updating open hours
https://fullcalendar.io/docs/business-hours
<<<<<<< HEAD
=======


>>>>>>> cec4ebf302d77a880b163a313281cc9db1d2db8c
