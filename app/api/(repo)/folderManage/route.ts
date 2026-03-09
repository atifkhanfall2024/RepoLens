import crypto from "crypto";
import path from "path";
import fs from "fs-extra";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

   
    const formData = await req.formData();

    const files = formData.getAll("file");

    //console.log("FILES:",files);

    if(!files.length){
      return NextResponse.json({
        success:false,
        message:"No file received"
      })
    }

    const folderName = crypto.randomBytes(6).toString("hex");

    const tempDir = path.join(process.cwd(),"temprepo",folderName);

    await fs.ensureDir(tempDir);

    for(const file of files){

      if(file instanceof File){

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(tempDir,file.name);

        await fs.writeFile(filePath,buffer);

      }
    }

    return NextResponse.json({
      success:true,
      folder:folderName
    })

  } catch(error){

    console.error("UPLOAD ERROR:",error);

    return NextResponse.json({
      success:false,
      message:"Upload failed"
    },{status:500})
  }
}