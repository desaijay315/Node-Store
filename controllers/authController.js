const passport    = require('passport');
const mongoose = require('mongoose'); 
const User          = mongoose.model('User');
const promisify   = require('es6-promisify');
const crypto       = require('crypto');
const mail          =  require('../handlers/mail');

exports.login  = passport.authenticate('local',{
    failureRedirect : '/login',
    failureFlash  : 'Failed Login',
    successRedirect :'/',
    successFlash : 'You are now logged in!'
});


exports.logout = (req,res) =>{
	req.logout();
	req.flash('success', 'You are now logged out!');
	res.redirect('/');
};

exports.isLoggedIn = (req,res,next) =>{
	//first check uer is athenticated
	if(req.isAuthenticated()){
               return  next();
	}
	req.flash('error', 'Oops You must be logged in!');
	res.redirect('/login');
};

exports.forgot = async (req,res) =>{
	// see the user exist or not
	
           const user = await User.findOne({email : req.body.email});

           if(!user){
           	  req.flash('error', 'No account with that email exists');
           	  return res.redirect('/login');
           }
	// set reset and expiry on their account
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPaswordExpires = Date.now() + 3600000; 
	await user.save();

	// send an email with the token
            const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
            
            await mail.send({
                        user,
             	subject: 'Password Reset',
             	resetURL,
             	filename:'password-reset'
             });

            req.flash('success', `You have been  emailed  a password a reset link.`);
	// redirect the login page
	res.redirect('/login');
};


exports.FindUser = async (req,res,next) =>{ 
   const token =  req.params.token;
   const user = await User.findOne({
   	resetPasswordToken: token,
   	resetPaswordExpires: {$gt: Date.now()}
   });
   if(!user){
     req.flash('error', 'Password reset is invalid or expired!');
     return res.redirect('/login');
   }
   next();
}

exports.reset = (req,res) =>{
   //if there is a user ,show the rest paswerd form 
   res.render('reset', {title : 'Reset your password'});

};

exports.confirmPasswords = (req,res,next) =>{
	
	if(req.body.password === req.body['password-confirm']){
               next(); //keep this going
               return;
	}
	req.flash('error', 'Password and confirm Passwords are not the same');
	res.redirect('back');
}

exports.update = async (req,res) =>{
  
   const token =  req.params.token;
   const user = await User.findOne({
   	resetPasswordToken: token,
   	resetPaswordExpires: {$gt: Date.now()}
   });
   if(!user){
     req.flash('error', 'Password reset is invalid or expired!');
     return res.redirect('/login');
   }

  const setPassword = promisify(user.setPassword, user) 
  await setPassword(req.body.password);
  
  user.resetPasswordToken = undefined;
  user.resetPaswordExpires = undefined;
  const updateduser = await user.save();
  
  await req.login(updateduser);

  req.flash('success', 'Nice ! Your pasword has been reset ! You are now logged in!');
  res.redirect('/');

};
