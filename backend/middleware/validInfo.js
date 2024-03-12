module.exports = function(req, res, next) {
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@coupa\.com$/.test(userEmail);
    }
  
    if (req.path === "/register") {        
      if (![email, name, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email, make sure you use your corporate email address.");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email, make sure you use your corporate email address.");
      }
    }
  
    next();
  };