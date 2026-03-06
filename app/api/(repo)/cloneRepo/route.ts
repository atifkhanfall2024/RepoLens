import { NextRequest, NextResponse } from "next/server";
import fs from 'fs-extra';
import simpleGit from "simple-git";
import path from "path";
import crypto from 'crypto'


type Data = {
  success: boolean;
  message: string;
  folderPath?: string;
};

export async function POST(req:NextRequest , res:NextResponse<Data>) {
    
    try {
        
        const {repo} = await req.json()
       if(!repo || !repo.startsWith("https://github.com/")){
        return NextResponse.json({ success: false, message: "Invalid GitHub URL" } , {status:400});
       }
   // generate a random folder
    const folderName = crypto.randomBytes(6).toString("hex");
    const tempDir = path.join(process.cwd(), "tmpRepos", folderName);

    // now ensure that it already exist or not
    await fs.ensureDir(tempDir)

    // clone repository
    const git  = simpleGit()
    await git.clone(repo , tempDir)

     return NextResponse.json({ success: true,
      message: "Repository cloned successfully",
      folderPath: tempDir} , {status:200})

    } catch (error) {
        let message = error instanceof Error ? error.message :"Some thing went wrong"

        return NextResponse.json({ success: false,
      message: message,
      })
    }

}