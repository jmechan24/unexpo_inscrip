var connect = require('./connect');


class Student {


    async filter_specialty() {
        try {
            var sql = " SELECT id, name FROM specialties ";
            var con = await connect.createConnection();

            var specialties = await new Promise((resolve, reject) => {
                con.query(sql, [], function (err, result) {

                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        reject(err)
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            name: result[i].name
                        })
                    }

                    resolve(list);
                })

            })

            return specialties;


        }
        catch (ex) {
            console.log(ex);
        }
    }

    async create(studentParm) {
        try {
            var sql = " INSERT INTO student SET specialty_id = ?, first_name = ?, last_name = ?, email = ?, id_student = ?, created_at = ? ";
            var param = [studentParm.specialty_id, studentParm.first_name, studentParm.last_name, studentParm.email, studentParm.id_student, new Date()];

            var con = await connect.createConnection();

            await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {
                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        console.log(err);
                        reject(err)
                        return;
                    }
                    resolve(result);
                })
            })

        }
        catch (ex) {
            console.log(ex);
        }
    }

    async update(studentParm, criteria) {
        try {
            var sql = " UPDATE student SET  ";
            var param = [];
            var values = "";

            if (studentParm.specialty_id) {
                values += (values ? ", " : "") + "specialty_id = ?"
                param.push(studentParm.specialty_id)
            }

            if (studentParm.first_name) {
                values += (values ? ", " : "") + "first_name = ?"
                param.push(studentParm.first_name)
            }

            if (studentParm.last_name) {
                values += (values ? ", " : "") + "last_name = ?"
                param.push(studentParm.last_name)
            }

            if (studentParm.email) {
                values += (values ? ", " : "") + "email = ?"
                param.push(studentParm.email)
            }

            if (studentParm.id_student) {
                values += (values ? ", " : "") + "id_student = ?"
                param.push(studentParm.id_student)
            }

            sql += values;

            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" id = ? ")
                param.push(criteria.id)
            }

            sql += condition;

            var con = await connect.createConnection();

            await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {
                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.
                    if (err) {
                        console.log(err);
                        reject(err)
                        return;
                    }
                    resolve(result);
                })
            })

        }
        catch (ex) {
            console.log(ex);
        }
    }

    async single(criteria) {
        try {

            criteria.limit = 1;
            let list = await this.filter(criteria)

            return list.length > 0 ? list[0] : null;
        }
        catch (ex) {
            console.log(ex);
        }
    }
    async filter(criteria) {
        try {

            var sql = `SELECT 
                            s.id, 
                            s.first_name,
                            s.last_name, 
                            s.email, 
                            s.id_student,
                            s.created_at,
                            sp.id specialty_id,
                            sp.name specialty
                        FROM 
                            student s
                        INNER JOIN 
                            specialties sp on sp.id =  s.specialty_id`;
            var param = [];

            var con = await connect.createConnection();

            var students = await new Promise((resolve, reject) => {
                con.query(sql, [], function (err, result) {

                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.  
                    if (err) {
                        reject(err)
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            first_name: result[i].first_name,
                            last_name: result[i].last_name,
                            email: result[i].email,
                            id_student: result[i].id_student,
                            created_at: result[i].created_at,
                            specialty_id: result[i].specialty_id,
                            specialty: result[i].specialty
                        })
                    }

                    resolve(list);
                })

            })

            return students;



        }
        catch (ex) {
            console.log(ex);
        }
    }

}

module.exports.Student = Student;