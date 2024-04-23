const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all responses from current week, no limit

router.get("/", authorization, async (req, res) => {
    try {
        const allResponses = await pool.query("SELECT * FROM responses WHERE menu_date >= date_trunc('week',current_date + interval '1 week') + interval '1 day'AND menu_date < date_trunc('week', current_date + interval '1 week') + interval '5 day' order by menu_date asc;");
        res.json(allResponses.rows);
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    }
)

module.exports = router;
