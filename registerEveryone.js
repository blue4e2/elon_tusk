import { createUser } from "./user/user.controller.js";

const registerAllUsers = async(client) => {
    const guild = client.guilds.cache.first();

    if(guild) {
        const members = await guild.members.fetch();

        members.forEach(async (member) =>{
            const newUser = await createUser({
                discordId: member.id,
                discordName: member.user.username
            });

            if(!newUser.success){
                console.log(newUser.message);
            }
    })
    }
} 

export default registerAllUsers;