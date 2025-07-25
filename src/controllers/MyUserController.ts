import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async(req: Request, res:Response) => {
    try{
        const {auth0Id} = req.body;
        const existingUser = await User.findOne({auth0Id})

        if (existingUser) {
            res.status(200).json(existingUser)
            return;
        }
        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).json(newUser)

    }catch (error){
        console.log(error);
        res.status(500).json({message: "Error creating user"})

    }
}


const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({_id: req.userId})
        if (!currentUser) {
            res.status(404).json({message: "User not found"})
            return;
        }
        res.json(currentUser)
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
        return;
    }
}

const updateCurrentUser = async(req:Request, res:Response) => {
    try{
        const {name, addressLine1, country, city} = req.body;
        const user = await User.findById(req.userId)

        if(!user) {
            res.status(404).json({message: "User not found"})
            return;
        }
        user.name = name;
        user.addressLine1= addressLine1;
        user.country = country;
        user.city = city;

        await user.save()
        res.send(user)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Error updating user"})
    }
}

export default {createCurrentUser, updateCurrentUser, getCurrentUser}



// import { RequestHandler } from "express";
// import User from "../models/user";

// const createCurrentUser: RequestHandler = async (req, res) => {
//   try {
//     const { auth0Id } = req.body;
//     const existingUser = await User.findOne({ auth0Id });

//     if (existingUser) {
//       res.status(200).json(existingUser); // ✅ no "return"
//       return;
//     }

//     const newUser = new User(req.body);
//     await newUser.save();

//     res.status(201).json(newUser); // ✅ no "return"
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating user" });
//   }
// };

// export default { createCurrentUser };