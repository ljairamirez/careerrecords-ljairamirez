# Deploying Salary Sheet on Vercel

1. Import this project into Vercel from GitHub, or upload the project with the Vercel CLI.
2. Keep the Framework Preset set to **Other** and the project root as the repository root.
3. In the Vercel project, open **Storage**, create a **Blob** store, and connect it to this project. Vercel will add `BLOB_READ_WRITE_TOKEN` automatically.
4. Redeploy after connecting Blob storage.

The website automatically uses `/api/salary-state` for logs and `/api/record-file` for credential attachments. Without a connected Blob store, the website still works but saves only in the current browser.
