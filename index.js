const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = Express();

app.use(cors());
app.use(bodyParser.json({limit: "200mb"}));
app.use(bodyParser.urlencoded({limit: "200mb", extended: true}));

app.use(Express.static(path.join(__dirname, "./files")));

app.use("/", (req, res) => {
    // return res.sendFile(path.join(dirname, "../../build/index.html"));
});

app.listen(80, () => {
    console.log('Back is running on Port', 80);
});