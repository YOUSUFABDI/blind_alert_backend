import express from "express"
import prisma from "../prisma/client"

const app = express()

app.use(express.json())

app.get("/", async (req, res) => {
  res.json({ message: "Hello!" })
})

export default app
