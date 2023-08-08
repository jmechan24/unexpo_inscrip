var connect = require('./connect');


class Period {

    async create(periodParm) {
        try {
            var sql = " INSERT INTO academic_period SET  period = ? , created_at = ? ";
            var param = [periodParm.period, new Date()];

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
                            s.period,                           
                            s.created_at                            
                        FROM 
                            academic_period s
                       `;
            var param = [];
            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" s.id = ? ")
                param.push(criteria.id)
            }

            sql += condition;

            if (criteria.limit)
                sql += " limit " + criteria.limit

            var con = await connect.createConnection();

            var periods = await new Promise((resolve, reject) => {
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
                            created_at: result[i].created_at
                        })
                    }

                    resolve(list);
                })

            })

            return periods;



        }
        catch (ex) {
            console.log(ex);
        }
    }

    async filter_classroom() {
        try {
            var sql = " SELECT id, code FROM classroom ";
            var con = await connect.createConnection();

            var classrooms = await new Promise((resolve, reject) => {
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
                            code: result[i].code
                        })
                    }

                    resolve(list);
                })

            })

            return classrooms;


        }
        catch (ex) {
            console.log(ex);
        }
    }
    async create_subject(periodParm) {
        try {
            var sql = " INSERT INTO academic_period_courses SET id_period = ? , id_teacher = ?, courses_id = ?, section = ?, classroom_id = ?, created_at = ? ";
            var param = [periodParm.id_period, periodParm.id_teacher, periodParm.courses_id, periodParm.section, periodParm.classroom_id, new Date()];

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

    async single_subject(criteria) {
        try {

            criteria.limit = 1;
            let list = await this.filter_subject(criteria)

            return list.length > 0 ? list[0] : null;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    async filter_subject(criteria) {
        try {

            var sql = `SELECT 
                            ps.id, 
                            ps.id_period,
                            a.name period,
                            ps.id_courses,
                            c.name courses,
                            ps.id_teacher,                            
                            t.name teacher,                            
                            ps.created_at                            
                        FROM 
                            academic_period_courses ps
                        INNER JOIN 
                            academic_period a ON ps.id_period = a.id
                        INNER JOIN                             
                            courses c  ON ps.id_courses = s.id
                        INNER JOIN                             
                            teacher t ON ps.id_teacher = t.id
                        INNER JOIN
                            classroom cl ON ps.id_classroom = cl.id
                       `;
            var param = [];
            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.id = ? ")
                param.push(criteria.id)
            }

            if (criteria.id_period) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.id_period = ? ")
                param.push(criteria.id_period)
            }

            if (criteria.id_teacher) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.id_teacher = ? ")
                param.push(criteria.id_teacher)
            }

            if (criteria.id_courses) {
                condition += (condition ? " AND " : " WHERE ") + (" ps.id_courses = ? ")
                param.push(criteria.id_courses)
            }


            sql += condition;

            if (criteria.limit)
                sql += " limit " + criteria.limit

            var con = await connect.createConnection();

            var periodSubjects = await new Promise((resolve, reject) => {
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
                            id_period: result[i].id_period,
                            courses: result[i].courses,
                            id_courses: result[i].id_courses,
                            id_teacher: result[i].id_teacher,
                            teacher: result[i].teacher,
                            created_at: result[i].created_at
                        })
                    }

                    resolve(list);
                })

            })

            return periodSubjects;



        }
        catch (ex) {
            console.log(ex);
        }
    }


    async delete_subject(periodParm) {
        try {
            var sql = " DELETE FROM academic_period_subject WHERE id = ? ";
            var param = [periodParm.id];

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

}

module.exports.Period = Period;