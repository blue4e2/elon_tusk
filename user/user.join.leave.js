import { createUser, deleteUser } from "./user.controller.js"

const handleUserJoin = async(member) => {
    const res = await createUser({
        discordId: member.id,
        discordName: member.user.username
    });

    console.log(res.message);    
}

const handleUserLeave = async(member) => {
    const res = await deleteUser({
        discordId: member.id
    });

    console.log(res.message);
}

export { handleUserJoin, handleUserLeave };