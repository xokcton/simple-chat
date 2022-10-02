import mongoose from "mongoose"

const establishDbConnection = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`Successfully connected to the MongoDb: ${conn.connection.host}:${conn.connection.port}`)
  } catch (error) {
    console.log(`MongoDb Connection Error: ${error.message}`)
    process.exit(1)
  }
}

export default establishDbConnection