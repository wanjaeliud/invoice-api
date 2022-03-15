const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const PORT = process.env.PORT || 3128

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())

app.get('/', function (req, res) {
  res.send('Welcome to Invoicing App.')
})

app.listen(PORT, function () {
  console.log(`App running on localhost:${PORT}.`)
})

const _ = require('lodash')

const multer = require('multer')
const upload = multer()

const bcrypt = require('bcrypt')
const db = require('./db/connect')
const saltRounds = 10

// POST /register - begin

app.post('/register', upload.none(), function (req, res) {
  // check to make sure none of the fields are empty
  console.log('=============================')
  console.log(req.body)
  console.log('======================')
  if (_.isEmpty(req.body.name) || _.isEmpty(req.body.email) ||
    _.isEmpty(req.body.company_name) || _.isEmpty(req.body.password)) {
    return res.json({
      'status': false, 'message': 'All fields are required.',
    })
  }

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

    let db = require('./db/connect')

    let sql = `INSERT INTO
                users(
                  name,
                  email,
                  company_name,
                  password
                )
                VALUES(
                  '${req.body.name}',
                  '${req.body.email}',
                  '${req.body.company_name}',
                  '${hash}'
                )`

    db.query(sql, function (err) {
      if (err) {
        // throw err;
        console.log('error: ', err)
      } else {
        return res.json({
          'status': true, 'message': 'User Created.',
        })
      }
    })

    // db.close();
  })

})

// POST /login - begin

app.post('/login', function (req, res) {
  let db = require('./db/connect')

  let sql = `SELECT * from users where email='${req.body.email}'`

  db.query(sql, [], (err, rows) => {
    if (err) {
      throw err
    }

    // db.close();

    if (rows.length === 0) {
      return res.json({
        'status': false, 'message': 'Sorry, wrong email.',
      })
    }

    let user = rows[0]

    let authenticated = bcrypt.compareSync(req.body.password, user.password)

    delete user.password

    if (authenticated) {
      return res.json({
        'status': true, 'user': user,
      })
    }

    return res.json({
      'status': false, 'message': 'Wrong password. Please retry.',
    })
  })

})

//search user by email
app.post('/search/email', (request, response) => {

  let sql = `SELECT * from users where email='${request.body.email}'`
  if (_.isEmpty(request.body.email)) {
    return response.json({
      'status': 401, 'message': 'email needed.',
    })
  } else {
    db.query(sql, function (error, result, field) {
      if (error) {
        return response.json({
          'status': '500',
          'message': 'internal server error',
        })
      } else {
        return response.json({
          'status': '200',
          'result': result,
        })
      }
    })
  }
})

app.post('/search/name', (request, response) => {

  let sql = `SELECT * from users where name='${request.body.name}'`
  if (_.isEmpty(request.body.name)) {
    return response.json({
      'status': 401, 'message': 'name needed.',
    })
  } else {
    db.query(sql, function (error, result, fieldData) {
      if (error) {
        return response.json({
          'status': '500',
          'message': 'internal server error',
        })
      } else {
        return response.json({
          'status': '200', 'result': result,
        })
      }
    })
  }
})
// POST /invoice - begin

app.post('/invoice', upload.none(), function (req, res) {
  // validate data
  if (_.isEmpty(req.body.name)) {
    return res.json({
      'status': false, 'message': 'Invoice needs a name.',
    })
  }

  // create invoice
  // let db = require('/db/connect');

  let sql = `INSERT INTO invoices(
                name,
                user_id,
                paid
              )
              VALUES(
                '${req.body.name}',
                '${req.body.user_id}',
                0
              )`

// ...
// ...

  db.query(function () {
    db.query(sql, function (err) {
      if (err) {
        throw err
      }

      let invoice_id = this.lastID

      for (let i = 0; i < req.body.txn_names.length; i++) {
        let data = `INSERT INTO
                      transactions(
                        name,
                        price,
                        invoice_id
                      ) VALUES(
                        '${req.body.txn_names[i]}',
                        '${req.body.txn_prices[i]}',
                        '${invoice_id}'
                      )`

        db.query(data);
      }

      return res.json({
        'status': true, 'message': 'Invoice created.',
      })
    })
  })

})