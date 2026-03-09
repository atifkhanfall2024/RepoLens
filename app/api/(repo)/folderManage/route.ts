import crypto from "crypto";
import path from "path";
import fs from "fs-extra";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json({ success: false, message: "No file received" });
    }

    // Optional: generate temp folder on server to preserve structure
    const folderName = crypto.randomBytes(6).toString("hex");
    const tempDir = path.join(process.cwd(), "temprepo", folderName);
    await fs.ensureDir(tempDir);

    // Save all files to tempDir while preserving nested paths
    for (const file of files) {
      if (file instanceof File) {
        const relativePath = (file as any).webkitRelativePath || file.name;
        const filePath = path.join(tempDir, relativePath);
        await fs.ensureDir(path.dirname(filePath));
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);
      }
    }

    // Send all files via FormData to FastAPI
    const formToPython = new FormData();

    for (const file of files) {
      if (file instanceof File) {
        const relativePath = (file as any).webkitRelativePath || file.name;
        const blob = new Blob([await file.arrayBuffer()]);
        formToPython.append("files", blob, relativePath); // preserve filename and folder
      }
    }

    const pythonAPI = "http://127.0.0.1:8000/Rag/data";
    const response = await fetch(pythonAPI, {
      method: "POST",
      body: formToPython
    });

    const data = await response.json();
    console.log("Python response:", data);

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}