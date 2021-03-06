const mongoose = require('mongoose');
const User          = mongoose.model('User');
const promisify   = require('es6-promisify');

exports.loginForm = (req, res) => {
	res.render('login', {title : 'Login'});
}

exports.registerForm = (req,res) =>{
       res.render('register', {title  : 'Register'});
}

exports.validateRegister = (req,res,next) =>{
    
     req.sanitizeBody('name');
     req.checkBody('name', 'You must supply a name!').notEmpty();
     req.checkBody('email', 'That Email is not valid!').isEmail();
     req.sanitizeBody('email').normalizeEmail({
         remove_dots:false,
         remove_extension:false,
         gmail_remove_subaddress:false
     });

     req.checkBody('password', 'Password cannot be Blank!').notEmpty();
     req.checkBody('password-confirm', 'Confirmed Password cannot be Blank!').notEmpty();
     req.checkBody('password-confirm', 'Oops! Your passwords do not match!').equals(req.body.password);
     
     const erorrs = req.validationErrors();

     if(erorrs){
       req.flash('error', erorrs.map(err => err.msg ));
       res.render('register', {title :'Register', body:req.body, flashes :req.flash()});
       return;
     }
     next();
};

exports.register = async(req,res,next) => {

  req.flash('info', 'Registration for demo purpose is not allowed');
  res.redirect('back');
    //added by jd
  // const user = new User({email : req.body.email, name:req.body.name});      
  // const register = promisify(User.register, User);
  // await register(user, req.body.password);
  // // res.send("it works!!");
  // next(); // pass to auth controller.ogin
};

exports.account = (req,res) =>{
	res.render('account', {title: 'Edit Your Account'});
};

exports.updateAccount = async (req,res) =>{
const update = {
	name : req.body.name,
	email:req.body.email
}
const user = await User.findOneAndUpdate(
      {_id  : req.user._id},
      {$set : update},
      {new : true, runValidators : true, context : 'query'}

      );
// res.json(user);
   res.redirect('back');
};