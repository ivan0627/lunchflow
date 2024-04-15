const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.delete("/", authorization, async (req, res) => {
    try {
        const { id } = req.user;
        const { email } = req.body;
        if (id !== 1) {
        return res.status(401).json("Not authorized");
        }
        const deleteUsers = await pool.query("DELETE FROM users WHERE email = $1", [
        email
        ]);
        res.json("User was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    });

    module.exports = router;