const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const  transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS  // generated ethereal password
        }
    });


const generateHTML = (filename, options= {}) => {
	const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`,options);
	const inlined = juice(html);
	return inlined;
};

exports.send = async(options) =>{
           const html = generateHTML(options.filename, options);
           const text  = htmlToText.fromString(html);

           const mailOptions = {
	        from: '"jay desai 👻" <desaijay315@gmail.com>', // sender address
	        to: options.user.email, // list of receivers
	        subject:options.subject, // Subject line
	        html,
	        text// plain text body
	        	
	};

	const sendMail =  promisify(transporter.sendMail, transporter);
	return sendMail(mailOptions);
}