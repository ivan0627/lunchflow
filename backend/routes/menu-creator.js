const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

//insert menu into the menus table
router.post("/", authorization, async (req, res) => {
    try {
        
        const { menu_date, menu_title, menu_description, menu_drink,
            option1,
            option2,
            option3,
            option4,
            option5,
            option6,
            option7,
            option8,
            option9,
            option10,
        user_email
        } = req.body;
        const newMenu = await pool.query("INSERT INTO menus (menu_date, menu_title, menu_description, menu_drink, option_1, option_2, option_3, option_4, option_5, option_6, option_7, option_8, option_9, option_10, user_email ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 ) RETURNING *", 
            [menu_date, menu_title, menu_description, menu_drink, option1, option2, option3, option4, option5, option6, option7, option8, option9, option10, user_email]); // Assuming options is an array with 10 elements
        res.json(newMenu.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;