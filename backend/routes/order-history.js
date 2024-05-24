const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all orders, limit to 50 
router.get("/", authorization, async (req, res) => {
  try {
        const allOrders = await pool.query("SELECT * FROM responses WHERE user_id = $1 order BY menu_date DESC LIMIT 50", [req.user]);
    res.json(allOrders.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// delete an order
router.delete("/:id", authorization, async (req, res) => {
  try {
    const id = req.params.order_id;
    const deleteOrder = await pool.query("DELETE FROM responses WHERE response_id = $1", [id]);
    res.json("Order was deleted");

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;