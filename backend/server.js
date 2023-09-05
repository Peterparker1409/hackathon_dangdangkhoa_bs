const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'khoa',
    database: 'quanli',
}).promise();

app.get('/users', async (req, res) => {
    try {
        const users = await db.execute('SELECT * FROM users')
        res.json({
            status: "success",
            users: users[0]
        })

    } catch (error) {
        console.log(error);
    }

});
app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;
    console.log(req.body);
    try {
        await db.execute('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age])
        res.json({
            status: "success",

        })

    } catch (error) {
        console.log(error);
    }
});
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
        // console.log(user);
        if (user[0].length > 0) {
            res.json({
                status: "ok",
                user: user[0]
            })
        }
        else {
            res.json({
                message: 'khong co user'
            })
        }

    } catch (error) {
        console.log(error);
    }

});
app.patch('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, age } = req.body;

    try {
        const user = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
        if (user[0].length > 0) {
            await db.execute('UPDATE users SET name = ? , email = ? , age = ? where id = ?', [name, email, age, userId])
            res.json({
                status: "ok",

            })
        }
        else {
            res.json({
                message: 'khong co user'
            })
        }
    } catch (error) {
        console.log(error);
    }
});
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
        if (user[0].length > 0) {
            await db.execute('DELETE FROM users where id = ?', [userId])
            res.json({
                status: `xoa thanh cong user ${userId}`,
            })
        }
        else {
            res.json({
                message: 'khong co user'
            })
        }

    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server đang chạy ---->>> ${port}`);
});
