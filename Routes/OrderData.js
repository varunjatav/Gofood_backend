const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

router.post('/orderData', async(req,res) => {
    let data = req.body.order_data;
    console.log(data);
    await data.slice(0,0, { order_date: req.body.order_date });
    console.log(data);

    let eId = await Order.findOne({ 'email': req.body.email });
    console.log(eId);
    if(eId === null){
        try {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            }).then(() =>{
                res.json({ success: true });
            })
        } catch (error) {
            console.log(error.message);
            res.send("Server error: " + error.message);
        }
    }
    else{
        try {
            await Order.findOneAndUpdate({
                email: req.body.email
            },
            {
                $push: { order_data: data }
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            res.send("Server Error: ", error.message);
        }
    }
});
router.get('/myOrderData', async(req,res) => {
    try {
        let myData = await Order.findOne({});
        console.log(myData);
        res.json({orderData: myData});
    } catch (error) {
        console.log(error);
        res.send("Server Error: ", error.message);
    }
// console.log(req);
});
module.exports = router;