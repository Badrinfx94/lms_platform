export const isTeacher=(userId?: string | null)=>{
    return userId ===process.env.NEXT_PUBLIC_TECHER_ID
}