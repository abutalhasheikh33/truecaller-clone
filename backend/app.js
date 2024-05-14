const dotenv = require('dotenv')
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require("./conn");
connectDB();

const authRouter = require('./routers/authRouters');
const contactRouter = require('./routers/contactRouters');
const errorControllers = require('./controllers/errorControllers');

app.use(cors())
app.use(express.json());
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/contact/", contactRouter);
app.use(errorControllers);


app.listen(5000, () => {
    console.log("Listening");
})