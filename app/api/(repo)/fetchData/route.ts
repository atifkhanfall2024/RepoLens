import { METHODS } from "http";
import { NextRequest, NextResponse } from "next/server";


type User = {
    Query:string
}

export async function POST(req:NextRequest) {
    
    try {
        const {Query}  = await req.json()
        
        if(!Query || Query === ""){
            return NextResponse.json({message:"USer Query Must Required"} , {status:401})
        }

        // here i were fetch api of python 
      const pythonAPI = "http://127.0.0.1:8000/retrieval/data";
    const response = await fetch(pythonAPI, {
      method: "POST",
       headers: {
    "Content-Type": "application/json"
  },
      body: JSON.stringify({query:Query})
    })

    const result  = await response.json()
    //console.log("Python Data "  , result);
    return NextResponse.json({ success: true, result });


    } catch (error) {
         const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({
      success: false,
      message
    }); 
    }

}