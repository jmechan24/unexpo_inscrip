var express = require('express');
var router = express.Router();
var classroomDB = require('../db/classroom')




router.get('/', async function (req, res) { // req = request, res = response
    var classroom_db = new classroomDB.Classroom();
    var classrooms = await classroom_db.filter();
    var locations = await classroom_db.filter_location();
    res.render('classroom/list', {
        title: "Salones",
        classrooms: classrooms || [],
        locations: locations
    });
})

router.get('/new/', async function (req, res) { // req = request, res = response
    var classroom_db = new classroomDB.Classroom();

    var classroom = await classroom_db.filter();
    var locations = await classroom_db.filter_location();
    res.render('classroom/new', {
        title: "Nuevo Salon",
        classroom: classroom,
        locations: locations
    });
})

router.post('/new', async function (req, res) {


    var classroom_db = new classroomDB.Classroom();
    await classroom_db.create({
        code: req.body.code,
        description: req.body.description,
        location_id: req.body.location
    });


    res.redirect('/classroom');
})

router.get('/update/:id', async function (req, res) { // req = request, res = response
    var classroom_db = new classroomDB.Classroom();

    var locations = await classroom_db.filter_location();
    var classrooms = await classroom_db.single({ id: req.params.id });

    res.render('classroom/update', {
        title: "Modificar Salon",
        classrooms: classrooms,
        locations: locations
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/classroom');
        return;
    }

    var classroom_db = new classroomDB.Classroom();
    await classroom_db.update({
        code: req.body.code,
        description: req.body.description,
        location_id: req.body.location
    }, {
        id: req.body.id
    });

    res.redirect('/classroom');
})


module.exports = router;
