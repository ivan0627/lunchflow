const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all orders, limit to 50 
router.get("/", authorization, async (req, res) => {
  try {
        const allOrders = await pool.query("SELECT * FROM responses WHERE user_id = $1 LIMIT 50", [req.user]);
    res.json(allOrders.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;