const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post ("/", authorization, async (req, res) => {
    try {
        const { user_email, menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note } = req.body;
        const checkResponse = await pool.query("SELECT * FROM responses WHERE user_email = $1 AND menu_id = $2", [ user_email, menu_id ]);
        if (checkResponse.rows.length > 0) {
            return res.status(409).json("Response already submitted");
        }
        const newResponse = await pool.query("INSERT INTO responses ( user_email, menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *", [ user_email,  menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note]);
        res.json(newResponse.rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}
);


module.exports = router;