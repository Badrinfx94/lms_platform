const {PrismaClient}= require("@prisma/client")

const database= new PrismaClient();

async function main(){
    try{
        await database.category.createMany({
            data:[
                {name:"Basic Machine Learning"},
                {name:"Advanced Machine learning"},
                {name:"Statistics Basics"},
                {name:"Foundation of Artifical intelligence"},
                {name:"Image processing using tensorflow"},
            ]
        })
        console.log("success")
    }catch(error){
        console.log("Error seeding the database categories", error)
    }finally{
        await database.$disconnect();
    }
}
main()