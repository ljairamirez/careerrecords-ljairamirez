const STATE_PATH = "salary-sheet/state.json";

async function blobSdk() {
  return import("@vercel/blob");
}

function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const managedKey = Object.keys(process.env).find((key) => /^BLOB_STORE_.*_READ_WRITE_TOKEN$/.test(key));
  return managedKey ? process.env[managedKey] : "";
}

function requireBlobToken() {
  const token = blobToken();
  if (!token) {
    const error = new Error("Vercel Blob storage is not connected.");
    error.code = "BLOB_NOT_CONNECTED";
    throw error;
  }
  return token;
}

async function putPrivate(pathname, body, contentType) {
  const token = requireBlobToken();
  const { put } = await blobSdk();
  return put(pathname, body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token
  });
}

async function getPrivate(pathname) {
  const token = requireBlobToken();
  const { get } = await blobSdk();
  const result = await get(pathname, { access: "private", token });
  if (!result || result.statusCode === 404) return null;
  if (result.statusCode && result.statusCode >= 400) {
    throw new Error(`Blob read failed: ${result.statusCode}`);
  }
  const stream = result.stream || result.body || result;
  const blobResponse = stream instanceof Response ? stream : new Response(stream);
  return {
    buffer: Buffer.from(await blobResponse.arrayBuffer()),
    contentType: result.contentType || blobResponse.headers.get("content-type") || "application/octet-stream"
  };
}

async function deletePrivate(pathnames) {
  const token = requireBlobToken();
  const { del } = await blobSdk();
  return del(pathnames, { token });
}

async function requestBuffer(request) {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === "string") return Buffer.from(request.body);
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

module.exports = {
  STATE_PATH,
  deletePrivate,
  getPrivate,
  putPrivate,
  requestBuffer
};
