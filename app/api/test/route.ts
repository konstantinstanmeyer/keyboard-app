import { NextRequest, NextResponse } from "next/server"
import mongoDBConnection from "@/mongodb/connection"

export async function GET(request: NextRequest){
    try {
        await mongoDBConnection();

        return NextResponse.json({ message: "Hello" }, { status: 200 })
    } catch(error){
        console.log("Error")
    }
}