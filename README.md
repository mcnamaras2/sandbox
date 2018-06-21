# Technology Sandbox Printer Queue
An online print queue for technology sandbox 3d printers

# Motivation
make it easy for Technology Sandbox Staff to schedule and edit 3D printing appointments.
make it easy to track printer usage

# Technology used
- https://firebase.google.com/ for data storage and hosting
- https://fullcalendar.io/ for UI

#Firebase Details
following the pattern described here https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html
there are two identical firebase projects representing two environments, one for development and one for production.

- tech-sandbox-print-queue-dev

- tech-sandbox-print-queue-prod
