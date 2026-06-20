const { getStore } = require("@netlify/blobs");

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

function safeId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function safeFileName(value) {
  return String(value || "attachment").replace(/[\r\n"\\/]/g, "_");
}

exports.handler = async (event) => {
  const id = safeId(event.queryStringParameters?.id);
  if (!id) {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: "Missing attachment id." }) };
  }

  const store = getStore("salary-sheet-files");
  const fileKey = `files/${id}`;
  const metaKey = `metadata/${id}`;

  try {
    if (event.httpMethod === "GET") {
      const [data, metadata] = await Promise.all([
        store.get(fileKey, { type: "arrayBuffer" }),
        store.get(metaKey, { type: "json" })
      ]);
      if (!data) return { statusCode: 404, headers: jsonHeaders, body: JSON.stringify({ error: "Attachment not found." }) };
      const name = safeFileName(metadata?.name);
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          "Content-Type": metadata?.type || "application/octet-stream",
          "Content-Disposition": `inline; filename="${name}"`,
          "Cache-Control": "private, max-age=3600"
        },
        body: Buffer.from(data).toString("base64")
      };
    }

    if (event.httpMethod === "POST") {
      const name = safeFileName(event.queryStringParameters?.name);
      const type = event.headers["content-type"] || "application/octet-stream";
      const data = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "utf8");
      if (!data.length) return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: "Empty attachment." }) };
      await Promise.all([
        store.set(fileKey, data),
        store.setJSON(metaKey, { name, type })
      ]);
      return {
        statusCode: 200,
        headers: jsonHeaders,
        body: JSON.stringify({ url: `/api/record-file?id=${encodeURIComponent(id)}` })
      };
    }

    if (event.httpMethod === "DELETE") {
      await Promise.all([store.delete(fileKey), store.delete(metaKey)]);
      return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ deleted: true }) };
    }

    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: "Method not allowed." }) };
  } catch (error) {
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: "Attachment storage failed." }) };
  }
};
