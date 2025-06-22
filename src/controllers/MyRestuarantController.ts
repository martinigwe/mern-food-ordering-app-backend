import { Request, Response } from "express";
import Restuarant from "../models/restuarant";
import cloudinary from "cloudinary"
import mongoose from "mongoose";


const getMyRestaurant = async(req: Request, res: Response)=> {
    try{
        const restaurant = await Restuarant.findOne({user: req.userId})
        if (!restaurant) {
            res.status(404).json({message: "Restaurant not found"})
            return;
        }

        res.json(restaurant)
    }catch(error){
        console.log(error)
        
        res.status(500).json({message: "Error fetching restaurant"})
    }
}

const createMyRestuarant = async (req: Request, res: Response) => {
    try{
        const existingRestuarant = await Restuarant.findOne({user: req.userId})

        if(existingRestuarant){
            res.status(409).json({message: "User restuarant already exists"})
            return;
        }

        // const image = req.file as Express.Multer.File;
        // const base64Image = Buffer.from(image.buffer).toString("base64")
        // const dataURI =`data:${image.mimetype};base64,${base64Image}`;

        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)

        const imageUrl = await uploadImage(req.file as Express.Multer.File)
        if (typeof req.body.menuItems === 'string') {
            req.body.menuItems = JSON.parse(req.body.menuItems);
          }
      
          if (typeof req.body.cuisines === 'string') {
            req.body.cuisines = JSON.parse(req.body.cuisines);
          }

        const restuarant = new Restuarant(req.body);
        restuarant.imageUrl = imageUrl
        restuarant.user = new mongoose.Types.ObjectId(req.userId);
        restuarant.lastUpdated =new Date()
        await restuarant.save();
        res.status(201).send(restuarant)
    } catch(error) {
        console.log(error)
        
        res.status(500).json({message: "Something went wrong", error})
    }
};


const updateMyRestaurant = async (req: Request, res: Response)=> {
    try {
        const restaurant = await Restuarant.findOne({user: req.userId})

        if(!restaurant) {
            res.status(404).json({message: "restaurant not found"})
            return
        }

        restaurant.restaurantName  =req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date()

        if(req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl
        }

        await restaurant.save();
        res.status(200).send(restaurant)
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong", error})

    }
    
}

const uploadImage = async (file: Express.Multer.File)=> {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI =`data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
    return uploadResponse.url
}



export default {createMyRestuarant, getMyRestaurant, updateMyRestaurant}