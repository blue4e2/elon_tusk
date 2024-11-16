import User from "../models/user.model.js"

const createUser = async(req) => {
    const { discordId, discordName } = req;
    
    try{
        const existingUser = await User.findOne({ discordId });

        if(existingUser){
            return { success: false, message: "User Already Exists"};
        }

        const newUser = new User({
            discordId,
            discordName
        });

        await newUser.save();

        return { success: true, message: "User created successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: String(err)};
    }
}

const editUser = async(req) => {
    const { discordId, discordName } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user){
            return { success: false, message: "User Not Found"};
        }

        if(discordName){
            user.discordName = discordName;
        }

        await newUser.save();

        return { success: true, data: editedUser };
    }catch(err){
        console.log(err);
        return { success: false, message: String(err)};
    }
}

const getUser = async(req) => {
    const { discordId } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user){
            return { success: false, message: "User Not Found"};
        }

        return { success: true, data: user };
    }catch(err){
        console.log(err);
        return { success: false, message: String(err)};
    }
}

const getAllUsers = async() => {

    try{
        const users = await User.find({});

        return { success: true, data: users };
    }catch(err){
        console.log(err);
        return { success: false, message: String(err)};
    }
}

const deleteUser = async(req) => {
    const { discordId } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user){
            return { success: false, message: "User Not Found"};
        }

        const deletedUser = await User.findOneAndDelete({ discordId });

        return { success: true, message: "User deleted successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: String(err)};
    }
}

export { createUser, getUser, getAllUsers, editUser, deleteUser };