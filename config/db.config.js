import {PrismaClient} from "@prisma/client"

// const prisma = new PrismaClient({
//     log:["query"]
// })
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

export default prisma