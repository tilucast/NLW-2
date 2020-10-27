const bcrypt = require('bcrypt')

export async function hashPassword(password: string){
    const saltRounds = 10

    const genSalt = await bcrypt.genSalt(saltRounds)
    const hashed = await bcrypt.hash(password, genSalt)
    return hashed
}

export async function compareHashPassword(password: string, hash: string){
    const match = await bcrypt.compare(password, hash)

    if(match)
        return true
    
    return false
} 