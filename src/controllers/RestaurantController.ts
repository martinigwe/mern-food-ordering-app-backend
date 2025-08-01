import { error } from "console";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const getRestaurant = async(req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;

        const restaurant = await Restaurant.findById(restaurantId);
        if(!restaurant) {
            res.status(404).json({message: "restaurant not found"})
            return;
        }

        res.json(restaurant)

    }catch(error) {
        console.log(error)
        res.status(500).json({message: "something went wrong"})
    }
}

const searchRestaurants = async (req: Request, res: Response) => {
    try {
        const city =  req.params.city;

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {}

        query["city"] = new RegExp(city, "i")
        const cityCheck = await Restaurant.countDocuments(query)
        // console.log(city, cityCheck)
        if(cityCheck == 0) {
            res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 0
                }
            })
            return;
        }

        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = {$all: cuisinesArray}
        }

        if(searchQuery) {
            const searcRegex = new RegExp(searchQuery, "i")
            query["$or"] = [{restaurantName: searcRegex}, {cuisines: {$in :[searcRegex]}}]
        }

        const pageSize = 10;
        const skip = (page-1)* pageSize;

        const restaurants = await Restaurant.find(query).sort({[sortOption]: 1}).skip(skip).limit(pageSize).lean();
        const total = await Restaurant.countDocuments(query)
        
        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total/ pageSize),
            }
        }

        res.json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
}

export default { searchRestaurants, getRestaurant}