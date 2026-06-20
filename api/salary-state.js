const { STATE_PATH, getPrivate, putPrivate } = require("../server/blob-storage");

module.exports = async function handler(request, response) {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");

  try {
    if (request.method === "GET") {
      const saved = await getPrivate(STATE_PATH);
      if (!saved) return response.status(200).json({ exists: false });
      return response.status(200).send(saved.buffer);
    }

    if (request.method === "POST") {
      const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
      if (!body.state || typeof body.state !== "object") {
        return response.status(400).json({ error: "Missing Salary Sheet state." });
      }
      const record = {
        exists: true,
        updatedAt: new Date().toISOString(),
        state: body.state
      };
      await putPrivate(STATE_PATH, JSON.stringify(record), "application/json");
      return response.status(200).json({ updatedAt: record.updatedAt });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    const status = error.code === "BLOB_NOT_CONNECTED" ? 503 : 500;
    return response.status(status).json({ error: error.message || "Salary Sheet storage failed." });
  }
};
