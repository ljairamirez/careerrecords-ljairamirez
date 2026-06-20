const { deletePrivate, getPrivate, putPrivate, requestBuffer } = require("../server/blob-storage");

function safeId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function safeFileName(value) {
  return String(value || "attachment").replace(/[\r\n"\\/]/g, "_");
}

module.exports = async function handler(request, response) {
  const id = safeId(request.query?.id);
  if (!id) return response.status(400).json({ error: "Missing attachment id." });

  const filePath = `salary-sheet/files/${id}`;
  const metadataPath = `salary-sheet/metadata/${id}.json`;

  try {
    if (request.method === "GET") {
      const [file, metadataFile] = await Promise.all([
        getPrivate(filePath),
        getPrivate(metadataPath)
      ]);
      if (!file) return response.status(404).json({ error: "Attachment not found." });
      const metadata = metadataFile ? JSON.parse(metadataFile.buffer.toString("utf8")) : {};
      response.setHeader("Content-Type", metadata.type || file.contentType);
      response.setHeader("Content-Disposition", `inline; filename="${safeFileName(metadata.name)}"`);
      response.setHeader("Cache-Control", "private, max-age=3600");
      return response.status(200).send(file.buffer);
    }

    if (request.method === "POST") {
      const data = await requestBuffer(request);
      if (!data.length) return response.status(400).json({ error: "Empty attachment." });
      const metadata = {
        name: safeFileName(request.query?.name),
        type: request.headers["content-type"] || "application/octet-stream"
      };
      await Promise.all([
        putPrivate(filePath, data, metadata.type),
        putPrivate(metadataPath, JSON.stringify(metadata), "application/json")
      ]);
      return response.status(200).json({ url: `/api/record-file?id=${encodeURIComponent(id)}` });
    }

    if (request.method === "DELETE") {
      await deletePrivate([filePath, metadataPath]);
      return response.status(200).json({ deleted: true });
    }

    response.setHeader("Allow", "GET, POST, DELETE");
    return response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    const status = error.code === "BLOB_NOT_CONNECTED" ? 503 : 500;
    return response.status(status).json({ error: error.message || "Attachment storage failed." });
  }
};
