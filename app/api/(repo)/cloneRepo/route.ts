import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import simpleGit from "simple-git";
import path from "path";
import crypto from "crypto";

type Data = {
  success: boolean;
  message: string;
  data?: any;
};

export async function POST(req: NextRequest) {
  try {

    const { repo } = await req.json();

    if (!repo || !repo.startsWith("https://github.com/")) {
      return NextResponse.json(
        { success: false, message: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    // create random repo folder
    const folderName = crypto.randomBytes(6).toString("hex");
    const tempDir = path.join(process.cwd(), "tmpRepos", folderName);

    await fs.ensureDir(tempDir);

    // clone repo
    const git = simpleGit();
    await git.clone(repo, tempDir);

    // create formdata
    const formData = new FormData();

    const walk = async (dir: string) => {
      const files = await fs.readdir(dir);

      for (const file of files) {

        // ignore heavy folders
        if (file === "node_modules" || file === ".git" || file === "dist" || file === "build") {
          continue;
        }

        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await walk(fullPath);
        } else {

          const buffer = await fs.readFile(fullPath);
          const relativePath = path.relative(tempDir, fullPath);

          const blob = new Blob([buffer]);

          formData.append("files", blob, relativePath);
        }
      }
    };

    // read repo files
    await walk(tempDir);

    // send to FastAPI
    const response = await fetch("http://127.0.0.1:8000/Rag/data", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Repository cloned and sent successfully",
      data: result
    });

  } catch (error) {

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({
      success: false,
      message
    });
  }
}