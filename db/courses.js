var connect = require('./connect');


class Courses {

    async create(coursesParm) {
        try {
            var sql = " INSERT INTO courses SET name = ? , credits = ? , description = ?,  created_at = ? ";
            var param = [coursesParm.name, coursesParm.credits, coursesParm.description, new Date()];

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

    async update(coursesParm, criteria) {
        try {
            var sql = " UPDATE courses SET  ";
            var param = [];
            var values = "";


            if (coursesParm.name) {
                values += (values ? ", " : "") + "name = ?"
                param.push(coursesParm.name)
            }

            if (coursesParm.credits) {
                values += (values ? ", " : "") + "credits = ?"
                param.push(coursesParm.credits)
            }

            if (coursesParm.description) {
                values += (values ? ", " : "") + "description = ?"
                param.push(coursesParm.description)
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
                            c.id,
                            c.name,
                            c.credits,
                            c.description,
                            c.created_at FROM courses c`;
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

            var courses = await new Promise((resolve, reject) => {
                con.query(sql, [], function (err, result) {
                    if (err) {
                        con.release(); // Release the connection in case of an error
                        reject(err);
                        return;
                    }

                    var list = [];

                    for (let i = 0; i < result.length; i++) {
                        list.push({
                            id: result[i].id,
                            name: result[i].name,
                            credits: result[i].credits,
                            description: result[i].description,
                            created_at: result[i].created_at
                        });
                    }


                    resolve(list);
                })

            })

            return courses;



        }
        catch (ex) {
            console.log(ex);
        }
    }

}

module.exports.Courses = Courses;