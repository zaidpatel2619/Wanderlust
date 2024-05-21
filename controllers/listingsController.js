const Listing = require("../models/listingsModel");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { filter, search } = req.query;
    let allListings;
    if (filter) {
        allListings = await Listing.find({ category: filter });
    } else if (search) {
        allListings = await Listing.find({ location: search }).collation({ locale: 'en', strength: 1 });
        if (!allListings.length) {
            allListings = await Listing.find({ title: search }).collation({ locale: 'en', strength: 1 });
        }
    }
    else allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render('listing/new.ejs');
};

module.exports.newListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let { path: url, filename } = req.file;
    let { listing } = req.body;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        res.redirect('/listings');
    }
    res.render("listing/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        res.redirect('/listings');
    }
    let imageUrl = listing.image.url;
    imageUrl.replace("/upload", "/upload/w_250");
    res.render("listing/edit.ejs", { listing, imageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};