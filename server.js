const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

mongoose.conneect("mongodb://localhost/27017")
    .then(()=>console.log("Connected to MongoDB"))
    .catch(error => console.log("Could not connect to MongoDB", error));

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    madeOf: [String],
});

const Item = mongoose. model("Item", item.Schema);

const createItem = async() => {
    const item = new Item({
        name: "Football",
        description: "Item thrown in football game",
        madeOf: ["rubber", "air", "pigskin"],
    });

    const result = await item.save();
    console.log(result);
};

createItem();

const upload = multer({ dest: __dirname + "/public/images"});

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

let item = [{
    id: 1,
    name: "Football",
    description: "Brown, pigskin",
    sport: "Football",
    madeOf: [
        "pigskin",
        "rubber",
        "air"
    ]
},
{
    id: 2,
    name: "Baseball",
    description: "Sphere, white and red, small",
    sport: "Baseball",
    madeOf: [
        "rubber",
        "yarn",
        "leather"
    ]
},
{
    id: 3,
    name: "Basketball",
    description: "Sphere, tan, big",
    sport: "Basketball",
    madeOf: [
        "rubber",
        "leather"
    ]
}
];

app.get("/api/item", (req, res) => {
    res.sendStatus(item)
});

app.listen(3000, () => {
    console.log("listening server.js");
});

const validate = (item) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        materials: Joi.allow(""),
        name: Joi.string().min(1).required(),
        description: Joi.string().min(3).required()
    });
    return schema.validate(item);
};

app.post("/api/item", upload.single("img"), (req, res) => {
    const result = validate(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    console.log(req.body);
    const jewel = {
        _id: item.length + 1,
        name: req.body.name,
        description: req.body.description,
        materials:req.body.materials.split(",")
    }
    if(req.file) {

    }
    jewels.push(jewel);
    res.send(jewel);
});

app.put("api/item/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const item = item.find((i) => i._id === id);
    const result = validate(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };
    item.name = req.body.name;
    item.description = req.body.description;
    item.materials = req.body.materials.split(", ");
    res.send(item);
});

app.delete("/api/item/:id", upload,single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const item = item.find((i) => i._id === id);
    if(!item) {
        res.status(404).send("No item found");
        return;
    }
    const index = item.indexOf(item);
    item.splice(index, 1);
    res.sent(item);
});