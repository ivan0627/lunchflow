const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.delete("/:email", authorization, async (req, res) => {
    try {
        
        const { email } = req.params;
        
        const deleteUsers = await pool.query("DELETE FROM users WHERE user_email = $1", [
        email
        ]);
        
        res.json("User was deleted!");
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    });

router.get("/", authorization, async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}
);

router.put("/", authorization, async (req, res) => {

    try {
        
        const { email } = req.body;
        
        const updateUser = await pool.query("UPDATE users SET role = 'admin' WHERE user_email = $1", [
        email
        ]);
        res.json("User was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

}
);

    module.exports = router;

