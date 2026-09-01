import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.warn('⚠️ R2 config missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in backend/.env');
}

// R2 is S3-compatible — same SDK, just pointed at Cloudflare's endpoint.
// This client (and the credentials it holds) only ever runs on the
// backend; nothing else in this app talks to R2 directly.
const r2 = new S3Client({
  region: 'auto',
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: { accessKeyId, secretAccessKey },
});

const UPLOAD_TTL_SECONDS = 15 * 60; // time an admin has to finish the PUT
const DOWNLOAD_TTL_SECONDS = 10 * 60; // minted fresh per request, never stored

/** A short-lived URL the browser can PUT a file straight to R2 with. */
export async function getUploadUrl(key, contentType) {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType || 'application/octet-stream' });
  return getSignedUrl(r2, cmd, { expiresIn: UPLOAD_TTL_SECONDS });
}

/** A short-lived URL to read one object. Minted per request — never persisted. */
export async function getDownloadUrl(key) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(r2, cmd, { expiresIn: DOWNLOAD_TTL_SECONDS });
}

/** Best-effort delete — called when a note/recording backed by R2 is removed. */
export async function deleteObject(key) {
  if (!key) return;
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Namespaced, collision-proof object key for a new upload. */
export function buildKey(kind, uploaderId, fileName) {
  const safeName = String(fileName || 'file').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
  return `${kind}/${uploaderId || 'unknown'}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}
