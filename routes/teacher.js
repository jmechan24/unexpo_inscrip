var express = require('express');
var router = express.Router();
var teacherDB = require('../db/teacher')



/*router.get('/', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();

    var teachers = await teacher_db.filter();
    res.render('teacher/list', {
        title: "Profesores",
        teachers: teachers
    });

})*/
router.get('/', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();
    var teachers = await teacher_db.filter();
    res.render('teacher/list', {
        title: "Profesores",
        teachers: teachers || []
    });
})

router.get('/new/', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();

    var teachers = await teacher_db.filter();
    res.render('teacher/new', {
        title: "Nuevo Profesor",
        teachers: teachers
    });
})


router.post('/new', async function (req, res) {


    var teacher_db = new teacherDB.Teacher();
    await teacher_db.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        phone: req.body.phone,
        email: req.body.email
    });

    res.redirect('/teacher');
})

router.get('/update/:id', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();


    var teacher = await teacher_db.single({ id: req.params.id });

    res.render('teacher/update', {
        title: "Modificar Profesor",
        teacher: teacher
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/teacher');
        return;
    }

    var teacher_db = new teacherDB.Teacher();
    await teacher_db.update({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        phone: req.body.phone
    }, {
        id: req.body.id
    });

    res.redirect('/teacher');
})


module.exports = router;


