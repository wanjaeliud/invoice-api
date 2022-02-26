// ...

// GET /invoice/user/:user_id - begin

app.get('/invoice/user/:user_id', upload.none(), function (req, res) {
    let db = require('./db/connect');

    let sql = `SELECT * FROM invoices WHERE user_id='${req.params.user_id}' ORDER BY invoices.id`;

    db.query(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        return res.json({
            "status": true,
            "invoices": rows
        });
    });
});

// GET /invoice/user/:user_id - end

// GET /invoice/user/:user_id/:invoice_id - begin

app.get('/invoice/user/:user_id/:invoice_id', upload.none(), function (req, res) {
    let db = require('./db/connect');

    let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}' AND invoice_id='${req.params.invoice_id}' ORDER BY transactions.id`;

    db.query(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        return res.json({
            "status": true,
            "transactions": rows
        });
    });
});
