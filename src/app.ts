import express from "express"

const app = express()

app.use(express.json())

app.get("/api", (req, res) => {
  res.json({ message: "Hello!" })
})

export default app
