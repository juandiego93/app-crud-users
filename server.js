//Packages
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user.models')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
})

//Instance of Express
const app = express()

// Middlewares
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

// Routes
app.post('/api/register', async (req, res) => {

    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Username' })
    }
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Password' })
    }
    if (plainTextPassword.length < 5) {
        return res.json({ status: 'error', error: 'Password too small. Should be atleast 6 chatracters ' })
    }
    const password = await bcrypt.hash(plainTextPassword, 10)
    try {
        const userC = await User.create({
            username,
            password
        })
    } catch (error) {
        if (error && error.code === 11000) {
            return res.json({ status: 'error', error: 'Username alreadyin use' })
        }
        throw error
    }
    res.json({ ok: true })
})

app.listen(9999, () => {
    console.log('listening on 9999')
})