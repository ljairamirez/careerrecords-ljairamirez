const { getStore } = require("@netlify/blobs");

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const store = getStore("salary-sheet");

  try {
    if (event.httpMethod === "GET") {
      const record = await store.get("state", { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(record || { exists: false })
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.state || typeof body.state !== "object") {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing Salary Sheet state." })
        };
      }

      const record = {
        exists: true,
        updatedAt: new Date().toISOString(),
        state: body.state
      };
      await store.setJSON("state", record);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ updatedAt: record.updatedAt })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed." })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Salary Sheet cloud sync failed." })
    };
  }
};
