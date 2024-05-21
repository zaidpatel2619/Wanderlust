const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { saveUrl } = require("../middlewares");
const { renderSignUpForm, signUpForm, renderLoginForm, loginForm, logoutForm } = require("../controllers/usersController");

router.route("/signup")
    .get(renderSignUpForm)
    .post(asyncWrap(signUpForm));

router.route("/login")
    .get(renderLoginForm)
    .post(saveUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        asyncWrap(loginForm)
    );

router.get("/logout", 
    logoutForm
);

module.exports = router;
