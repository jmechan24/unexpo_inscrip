var express = require('express');
var router = express.Router();
var periodDB = require('../db/period')
var coursesDB = require('../db/courses')
var teacherDB = require('../db/teacher')

router.get('/', async function (req, res) { // req = request, res = response
    var period_db = new periodDB.Period();

    var periods = await period_db.filter({});
    res.render('period/list', {
        title: "Periodos academicos",
        periods: periods
    });

})


router.get('/new/', async function (req, res) { // req = request, res = response


    res.render('period/new', {
        title: "Nueva Periodo academico"
    });

})

router.post('/new', async function (req, res) {


    var period_db = new periodDB.Period();
    await period_db.create({
        period: req.body.period
    });

    res.redirect('/period');
})

router.get('/courses/:period_id', async function (req, res) { // req = request, res = response
    var period_db = new periodDB.Period();

    var list = await period_db.filter_courses({ id_period: req.params.id_period });
    res.render('period/list_courses', {
        title: "Materias por periodos academicos",
        list: list,
        id_period: req.params.id_period
    });

})

router.get('/courses/new/:id_period', async function (req, res) { // req = request, res = response

    var teacher_db = new teacherDB.Teacher();
    var courses_db = new coursesDB.Subject();

    let teachers = await teacher_db.filter({});
    let courses = await courses_db.filter({});

    res.render('period/new_courses', {
        title: "Asignar materia a periodo academico",
        teachers: teachers,
        courses: courses,
        id_period: req.params.id_period,
        model: null
    });

})

router.post('/courses/new', async function (req, res) {


    var period_db = new periodDB.Period();
    var teacher_db = new teacherDB.Teacher();
    var courses_db = new coursesDB.Courses();

    let teachers = await teacher_db.filter({});
    let courses = await courses_db.filter({});
    let model = {
        id_teacher: req.body.id_teacher,
        id_courses: req.body.id_courses,
        id_classroom: req.body.id_classroom,
        section: req.body.section
    };

    if (!req.body.id_period || !req.body.id_teacher || !req.body.id_courses || !req.body.id_classroom || !req.body.section) {
        res.render('period/new_courses', {
            title: "Asignar materia a periodo academico",
            teachers: teachers,
            courses: courses,
            id_period: req.body.id_period,
            model: model,
            message: "Datos incompletos"
        });

        return;
    }

    var item = await period_db.single_courses({
        id_period: req.body.id_period,
        id_teacher: req.body.id_teacher,
        id_courses: req.body.id_courses,
    });

    if (item) {
        res.render('period/new_courses', {
            title: "Asignar materia a periodo academico",
            teachers: teachers,
            courses: courses,
            id_period: req.body.id_period,
            model: model,
            message: "Ya se ha asignado el profesor a la materia"
        });

        return;
    }

    await period_db.create_courses({
        id_period: req.body.id_period,
        id_teacher: req.body.id_teacher,
        id_courses: req.body.id_courses,
        id_classroom: req.body.id_classroom,
        section: req.body.section
    });

    res.redirect('/period/courses/' + req.body.id_period);
})

router.post('/courses/delete', async function (req, res) {

    var period_db = new periodDB.Period();

    if (req.body.id)
        await period_db.delete_courses({
            id: req.body.id
        });

    res.send(JSON.stringify({ code: 0 }));
})






module.exports = router;