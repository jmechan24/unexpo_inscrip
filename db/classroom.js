var connect = require('./connect');


class Classroom {

    async filter_location() {
        try {
            var sql = " SELECT id, location FROM locations ";
            var con = await connect.createConnection();

            var locations = await new Promise((resolve, reject) => {
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
                            location: result[i].location
                        })
                    }

                    resolve(list);
                })

            })

            return locations;


        }
        catch (ex) {
            console.log(ex);
        }
    }
    async create(classroomParm) {
        try {
            var sql = " INSERT INTO classroom SET location_id = ? , code = ? ";
            var param = [classroomParm.location_id, classroomParm.code];

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

    async update(classroomParm, criteria) {
        try {
            var sql = " UPDATE classroom SET  ";
            var param = [];
            var values = "";

            if (classroomParm.location_id) {
                values += (values ? ", " : "") + "location_id = ?"
                param.push(classroomParm.location_id)
            }

            if (classroomParm.code) {
                values += (values ? ", " : "") + "code = ?"
                param.push(classroomParm.code)
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
                            cr.id, 
                            cr.code,
                            l.location,
                            l.id FROM classroom cr
                            INNER JOIN
                                locations l on l.id = cr.location_id`;
            var param = [];
/*            let condition = "";

            if (criteria.id) {
                condition += (condition ? " AND " : " WHERE ") + (" s.id = ? ")
                param.push(criteria.id)
            }

            sql += condition;
            if (criteria.limit)
                sql += " limit " + criteria.limit
*/
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
                            code: result[i].code,
                            location_id: result[i].location_id,
                            location: result[i].location,
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

}

module.exports.Classroom = Classroom;
