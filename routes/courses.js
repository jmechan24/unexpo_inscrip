var express = require('express');
var router = express.Router();
var coursesDB = require('../db/courses')



/*router.get('/', async function (req, res) { // req = request, res = response
    var courses_db = new coursesDB.Courses();

    var courses = await courses_db.filter();
    res.render('courses/list', {
        title: "Materias",
        courses: courses
    });

})*/
router.get('/', async function (req, res) { // req = request, res = response
    var courses_db = new coursesDB.Courses();
    var courses = await courses_db.filter();
    res.render('courses/list', {
        title: "Materias",
        courses: courses || []
    });
})

router.get('/new/', async function (req, res) { // req = request, res = response
    var courses_db = new coursesDB.Courses();

    var courses = await courses_db.filter();
    res.render('courses/new', {
        title: "Nueva Materia",
        courses: courses
    });
})

router.post('/new', async function (req, res) {


    var courses_db = new coursesDB.Courses();
    await courses_db.create({
        name: req.body.name,
        credits: req.body.credits,
        description: req.body.description
    });

    res.redirect('/courses');
})

router.get('/update/:id', async function (req, res) { // req = request, res = response
    var courses_db = new coursesDB.Courses();


    var courses = await courses_db.single({ id: req.params.id });

    res.render('courses/update', {
        title: "Modificar Materia",
        courses: courses
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/courses');
        return;
    }

    var courses_db = new coursesDB.Courses();

    await courses_db.update({
        name: req.body.name,
        credits: req.body.credits,
        description: req.body.description
    }, {
        id: req.body.id
});

    res.redirect('/courses');
})

module.exports = router;
