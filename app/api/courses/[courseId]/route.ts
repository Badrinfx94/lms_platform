import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { db } from "@/lib/db";
const Video=new Mux({
    tokenId:process.env['MUX_TOKEN_ID'],
    tokenSecret:process.env['MUX_TOKEN_SECRET']
})

export async function DELETE(
    req:Request,
    {params}:{params:{courseId:string}}
){
    try{
        const {userId} =auth()

        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }

        const course=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            },
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                }
            }
        })

        if(!course){
            return new NextResponse("Not found",{status:404})
        }
        for (const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await Video.video.assets.delete(chapter.muxData.assetId)
            }
        }

        const deleteCourse= await db.course.delete({
            where:{
                id:params.courseId
            }
        })

        return NextResponse.json(deleteCourse)
    }catch(error){
        console.log("[CHAPTER_DELETE]",error)
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string}}
){
    try{
        const {userId} =auth()
        const {courseId} =params;
        const values=await req.json()
        
        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }

        const course=await db.course.update({
            where:{
                id:courseId,
                userId
            },
            data:{
                ...values
            }
        })
        return NextResponse.json(course)
    }catch(error){
        console.log("[CourseID]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}