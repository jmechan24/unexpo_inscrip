var express = require('express');
var router = express.Router();
var enrollmentDB = require('../db/enrollment')

router.get('/enrollment/:period_id', async function (req, res) { // req = request, res = response
    var enrollment_db = new enrollmentDB.Enrollments();
    var enrollment = await enrollment_db.filter();
    res.render('enrollment/list', {
        title: "Inscripcion",
        enrollment: enrollment || []
    });
})

module.exports = router;
