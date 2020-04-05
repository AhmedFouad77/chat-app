const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send('im in chat ')
});

module.exports = router;
