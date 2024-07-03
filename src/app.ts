import express from "express"
import prisma from "../prisma/client"

const app = express()

app.use(express.json())

app.get("/api", async (req, res) => {
  const test = await prisma.test.findMany()
  res.json({ message: test })
})

export default app
