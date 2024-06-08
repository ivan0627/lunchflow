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

// Get filtered responses based on date range
router.post("/", authorization, async (req, res) => {
    const { date1, date2 } = req.body;
    try {
        const filteredResponses = await pool.query(`
            SELECT *
            FROM responses
            WHERE creation_date BETWEEN $1 AND $2
        `, [date1, date2]);
        res.json(filteredResponses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
