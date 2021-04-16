const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation/Validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authVerify = require('../validation/VerifyToken')
const dotenv = require('dotenv');
dotenv.config();

router.use((req, res, next) => {
    console.log("Time:", new Date())
    next()
});



router.post('/register', async (req, res) => {
    try {
        const { error } = await registerValidation(req.body);
        if (error) {
            console.log(error);
            res.status(400).json(error.details[0].message);
        }
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) { res.status(400).send("Email is already there!") }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        try {
            const newUser = await user.save();
            res.status(200).json(newUser);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }

    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error } = await loginValidation(req.body);
        if (error) {
            console.log(error);
            res.status(400).json(error.details[0].message);
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) { res.status(400).send("Email does not exist!") }

        const validatePass = await bcrypt.compare(req.body.password, user.password);
        if (!validatePass) { res.status(400).send("Password is wrong!") }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header(token).json({
            id: user._id,
            token: token
        });

    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/getuser', authVerify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) { res.status(400).send("User does not exist!") }
        console.log(user.name, user.email);
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        
    }
})

module.exports = router;
