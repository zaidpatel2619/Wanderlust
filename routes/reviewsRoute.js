const express = require("express");
const router = express.Router( { mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, validateReview, isAuthor } = require("../middlewares.js");
const { addReview, destroyReview } = require("../controllers/reviewsController.js");

//ADD REVIEWS 
router.post("/", 
    isLoggedIn, 
    validateReview, 
    asyncWrap(addReview)
);

//DELETE REVIEW
router.delete("/:reviewId", 
    isLoggedIn, 
    isAuthor, 
    asyncWrap(destroyReview)
);

module.exports = router;