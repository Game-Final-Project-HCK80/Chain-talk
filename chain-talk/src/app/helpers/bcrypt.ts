import bcrypt from "bcryptjs"

export function hashPassword (password: string){
    const hash = bcrypt.hashSync(password);
    return hash
};

export function comparePassword (password: string, hashedPassword: string){
    return bcrypt.compareSync(password, hashedPassword);
}