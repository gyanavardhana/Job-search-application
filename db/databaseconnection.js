const express = require('express');
const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGO_URI, {})
        .then(() => console.log("Database Connected"));
}
catch (err) {
    console.log(err);
    console.log("some error in connecting to database");
}