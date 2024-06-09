const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

//get all menus from the next 7 days

router.get("/", authorization, async (req, res) => {
    try {
        /*
        const menus = await pool.query("SELECT * FROM menus WHERE menu_date >= date_trunc('week',current_date + interval '1 week') + interval '1 day'AND menu_date < date_trunc('week', current_date + interval '1 week') + interval '5 day'; ");
        res.json(menus.rows);
        */
       const menus = await pool.query("SELECT * FROM menus WHERE menu_date >= date_trunc('week', current_date) + interval '4 day' AND menu_date < date_trunc('week', current_date + interval '1 week') + interval '8 day'; ");
       res.json(menus.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;