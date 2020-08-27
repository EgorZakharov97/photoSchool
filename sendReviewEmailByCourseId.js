require('dotenv').config();

const Course = require('./models/Course'),
    User = require('./models/User'),
    mongoose = require('mongoose'),
    sendMail = require('./service/email/mailTransporter'),
    ejs = require('ejs'),
    fs = require('fs');

const args = process.argv;

if(args.length == 3){
    let courseID = args[2];

    // DATABASE
    if(process.env.NODE_ENV === 'development'){
        mongoose.connect(process.env.DB_CONNECT_DEV, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    } else {
        mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    }

    Course.findById(courseID, async (err, course) => {
        if(err){
            console.log(err)
            return
        } else {
            const emails = await User.find({courses: {$in: [course._id]}}).select('email');

            fs.readFile('./service/email/templates/request-for-review.html', 'utf-8', (err, template) => {
                emails.filter(emailObj => {
                    let email = emailObj.email;
                    let data = {
                        to: email,
                        subject: "Do you want to share your opinion?",
                        html: ejs.render(template, {HOST: process.env.HOST, email: email})
                    };
    
                    sendMail(data);
                });
            });
            
            mongoose.connection.close();
        }
    })

    

} else {
    console.log('Wrong number of arguments. Should be One')
}