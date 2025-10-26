const { createClient } = require("redis");

const initRedis = async () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL, // plain TCP, no TLS
    });

    client.on("error", (err) => console.error("Redis connection failed:", err));

    await client.connect();
    console.log("✅ Redis connected successfully");
    return client;
  } catch (error) {
    console.error("❌ Redis initialization error:", error);
  }
};

module.exports = initRedis;
