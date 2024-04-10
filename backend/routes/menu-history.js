const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        const menuHistory = await pool.query("SELECT * FROM menus");
        res.json(menuHistory.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMenu = await pool.query("DELETE FROM menus WHERE menu_id = $1", [id]);
        res.json("Menu was deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}
);



module.exports = router;