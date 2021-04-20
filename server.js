const express = require("express");
const cors = require("cors");

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const app = express(); // one application
const router = express.Router(); // server side router
const fileNames = {
};

//const reportsObj = require(fileNames.Reports);

firebase.initializeApp({
    apiKey: '### FIREBASE API KEY ###',
    authDomain: '### FIREBASE AUTH DOMAIN ###',
    projectId: '### CLOUD FIRESTORE PROJECT ID ###'
  });
  
  var db = firebase.firestore();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors()); // sets the header instead !

router.get("/reports", function(req, res) {
    res.json(reportsObj); //converts js object to JSON
});

router.get("/units", function(req, res) {

    res.json(unitsObj); //converts js object to JSON
});

router.post("/units", function(req, res) {

    const resUnitObject = req.body.units;

    const newUnit = {
        id: resUnitObject.id,
        status: resUnitObject.status,
        serial: resUnitObject.serial,
        type: resUnitObject.type,
        name: resUnitObject.name,
        assignedto: resUnitObject.assignedto,
        from: resUnitObject.from,
    };

    unitsObj.push(newUnit);
    res.json({ success: "Record Inserted successfully" });
});

router.get("/userunits", function(req, res) {
    res.json(userunitsObj); //converts js object to JSON
});

// Method:POST , API -> /units
router.post("/userunits", function(req, res) {

    userunitsObj.push({
        id: req.body.report.id,
        name: req.body.userunit.name,
        type: req.body.userunit.type,
        username: req.body.userunit.username,
        email: req.body.userunit.email,
        skype: req.body.userunit.skype,
        _id: req.body.userunit.name + Math.random(),
        from: req.body.userunit.from,
    });
    // res.json(userunitsObj); //converts js object to JSON
    // OR
    res.json({ success: "Record Inserted successfully" });
});

// Administrator API
//Method:GET , API -> /administrator
router.get("/administrator", function(req, res) {
    res.json(adminObj); //converts js object to JSON
});

// Settings API
router.get("/settings", function(req, res) {
    res.json(settingsObj); //converts js object to JSON
});

// Method:POST , API -> /settings
router.post("/settings", function(req, res) {

    settingsObj.push({
        id: req.body.setting.setting.id,
        name: req.body.setting.name,
        shortname: req.body.setting.shortname,
        properties: req.body.setting.properties,
        parts: req.body.setting.parts,
    });
    // res.json(userunitsObj); //converts js object to JSON
    // OR
    res.json({ success: "Record Inserted successfully" });
});

app.use(router);
app.listen(4000, () => console.log("Server running @ 4000 !"));