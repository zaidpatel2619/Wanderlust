const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require('../utils/asyncWrap.js');
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const { index, filteredIndex, newListing, renderNewForm, renderEditForm, destroyListing, updateListing, showListing } = require("../controllers/listingsController.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(asyncWrap(index))  // ALL LISTING
    // .get(asyncWrap(filteredIndex))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing, 
        asyncWrap(newListing)); // API FOR NEW LISTING

// CREATE NEW LISTING
router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id",)
    .get(showListing) // VIEW LISTING
    .put(isLoggedIn, 
        isOwner,
        upload.single("listing[image]"), 
        validateListing, 
        updateListing) // API FOR EDIT LISTING 
    .delete(isLoggedIn, isOwner, destroyListing);  // DELETE LISTING API


// EDIT LISTING
router.get("/:id/edit", 
    isLoggedIn, 
    renderEditForm
);

module.exports = router;
