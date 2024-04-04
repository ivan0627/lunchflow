const router = require('express').Router();
const pool = require('../db');
const bycrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');
const e = require('express');
// register

router.post("/register", validInfo, async(req, res) => {
    try {
        //1. destructure the req.body (name, email, password)
        const { name, email, password } = req.body;

        //2. check if user exists (if user exists then throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length > 0) {
            return res.status(401).json({ message: "User already exists with this email" });
        }


        //3. Bcrypt the user password
        
        const saltRound = 10;
        const salt = await bycrypt.genSalt(saltRound);

        const bycryptPassword = await bycrypt.hash(password, salt);

        //4. enter the new user inside our database

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bycryptPassword]);

        //5. generate jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token}); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

// login route

router.post("/login", validInfo,  async(req, res) => {
    try{
        //1. destructure the req.body
        const { email, password } = req.body;

        //2. check if user doesn't exist (if not then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Password or Email is incorrect" });
        }

        //3. check if incoming password is the same as the database password
        const validPassword = await bycrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json({ message: "Password or Email is incorrect" });
        }

        //4. give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({token});


    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

router.get("/is-verified", authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

})

router.post("/admin", authorization, async (req, res) => {
    try {
        const email = req.body.email;
        
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1 and role = 'admin'", [email]);
        console.log(user.rows)

        if (user.rows.length === 0) {
            console.log("User is not an admin");
            return res.status(401).json({ message: "You are not an admin" });
        }
        
        res.json({ message: "You are an admin" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//insert menu into the menus table
router.post("/menu-creator", authorization, async (req, res) => {
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

//get all menus from the next 7 days

router.get("/menus", authorization, async (req, res) => {
    try {
        const user_email = req.user;
        const menus = await pool.query("SELECT * FROM menus WHERE menu_date >= date_trunc('week',current_date + interval '1 week') + interval '1 day'AND menu_date < date_trunc('week', current_date + interval '1 week') + interval '5 day'; ");
        res.json(menus.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post ("/responses", authorization, async (req, res) => {
    try {
        const { response_id, user_email, creation_date, menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note } = req.body;
        const newResponse = await pool.query("INSERT INTO responses (response_id, user_email, creation_date, menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [response_id, user_email, creation_date, menu_date, menu_title, menu_description, menu_drink, menu_id, menu_option, menu_note]);
        res.json(newResponse.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}
);



module.exports = router;