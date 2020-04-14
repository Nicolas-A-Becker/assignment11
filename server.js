const express = require('express');
const app = express();
const Joi = require('joi');
app.use(express.static('public'));
app.use(express.json());

let drinks = [
    {id:0, name:'Root Beer', description:'Rich vanilla and sassafras drink', carbonated:'yes'},
    {id:1, name:'Orange Juice', description:'Juice from squezed oranges', carbonated:'no'},
    {id:2, name:'Arnold Palmer', description:'Half lemonade and half sweet tea', carbonated:'no'},
    {id:3, name:'Coke', description:'Classic cola drink', carbonated:'yes'},
    {id:4, name:'Sprite', description:'Lemon lime soda', carbonated:'yes'},
    {id:5, name:'Water', description:'Just H2O that\'s it', carbonated:'occasionally'}
];

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/drinks', (req,res)=>{
    res.send(drinks);
});

app.get('/api/drinks/:id', (req,res)=>{
    const drink = drinks.find(d => d.id === parseInt(req.params.id));

    if(!drink) res.status(404).send('The drink was not found');

    res.send(drink);
});

app.post('/api/drinks', (req,res)=>{
    const result = validateDrink(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const drink = {
        id:drinks.length,
        name:req.body.name,
        description:req.body.description,
        carbonated:req.body.carbonated
    };

    drinks.push(drink);
    res.send(drink);
});

function validateDrink(drink){
    const schema = {
        name:Joi.string().min(3).required(),
        description:Joi.string().min(3).required(),
        carbonated:Joi.string().min(3).required()
    };

    return Joi.validate(drink, schema);
}

app.put("/api/drinks/:id", (req,res)=>{
    const drink = drinks.find(d=>d.id === parseInt(req.params.id));

    if(!drink)
        res.status(404).send("Drink with given id was not found");

    const result = validateDrink(req.body);

    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }

    drink.name = req.body.name;
    drink.description = req.body.description;
    drink.carbonated = req.body.carbonated;
    res.send(drink);
});

app.delete("/api/drinks/:id", (req,res)=>{
    const drink = drinks.find(d=>d.id === parseInt(req.params.id));

    if(!drink){
        req.status(404).send("Drink with given id was not found");
    }

    const index = drinks.indexOf(drink);
    drinks.splice(index, 1);

    res.send(drink);
})

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});