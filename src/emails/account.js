const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'TusharSethi@pesu.pes.edu',
        subject: 'Welcome To Tasks App!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app and if any updates are required.`
    })
}

const sendGoodbyeEmail = (email, name)  => {
    sgMail.send({
        to: email,
        from: 'TusharSethi@pesu.pes.edu',
        subject: 'Deepest Apologies',
        text: `We are so sorry to see that you're leaving ${name}. We hope to correct the mistakes we have committed with you, 
        Please let us know if there are any changes we should make to make sure our next customer doesn't go unsatisfied`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
}