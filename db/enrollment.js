var connect = require('./connect');

class Enrollments {
    async create_enrollment(enrollmentParm) {
        try {
            var sql = " INSERT INTO enrollment SET id = ?, id_student = ?, details = ?, status = ?, date = ? ";
            var param = [enrollmentParm.id, enrollmentParm.id_student, enrollmentParm.details, enrollmentParm.status, new Date()];

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

        } catch (ex) {
            console.log(ex);
        }
    }

    async filter_enrollments(criteria) {
        try {
            var sql = `SELECT 
                                e.id, 
                                e.id_period,
                                a.name period,
                                e.id_student,
                                s.first_name student,
                                s.last_name student,
                                e.status,
                                e.date                            
                            FROM 
                                enrollment e
                            INNER JOIN 
                                academic_period a ON e.id_period = a.id
                            INNER JOIN                             
                                student s  ON e.id_student = s.id
                            WHERE e.id_period = ?`;
            var param = [criteria.id];
            let condition = "";

            if (criteria.id_academic_period) {
                condition += (condition ? " AND " : " WHERE ") + (" m.id_period = ? ")
                param.push(criteria.id_academic_period)
            }

            if (criteria.id_student) {
                condition += (condition ? " AND " : " WHERE ") + (" m.id_student = ? ")
                param.push(criteria.id_student)
            }

            sql += condition;

            if (criteria.limit)
                sql += " limit " + criteria.limit

            var con = await connect.createConnection();

            var enrollments = await new Promise((resolve, reject) => {
                con.query(sql, param, function (err, result) {

                    con.release(); // Importante siempre liberar la conexión despues de utilizarla.
                    if (err) {
                        reject(err)
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            period: result[i].period,
                            id_academic_period: result[i].id_academic_period,
                            student: result[i].student,
                            id_student: result[i].id_student,
                            status: result[i].status,
                            date: result[i].date
                        })
                    }

                    resolve(list);
                })

            })

            return enrollments;

        } catch (ex) {
            console.log(ex);
        }
    }
}
module.exports.Enrollments = Enrollments;