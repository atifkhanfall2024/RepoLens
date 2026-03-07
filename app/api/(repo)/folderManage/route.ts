import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import path from "path";
import fs from "fs-extra";
import formidable from "formidable";

// Disable Next.js body parser for this API
export const runtime = "nodejs";

export  async function handler(req: NextApiRequest, res: NextApiResponse) {
 

  try {
    const folderName = crypto.randomBytes(6).toString("hex");
    const tempDir = path.join(process.cwd(), "temprepo", folderName);
    await fs.ensureDir(tempDir);

    const form = formidable({ multiples: true, uploadDir: tempDir, keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      console.log("Uploaded files:", files);

      res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
        folderPath: tempDir,
        files,
      });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ success: false, message });
  }
}