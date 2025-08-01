import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req: Request, res:Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
    }

    next();
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("addressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("city must be a string"),
    body("country").isString().notEmpty().withMessage("country must be a string"),
    handleValidationErrors,

]


export const validateMyRestauranRequest = [
    body("restaurantName").isString().notEmpty().withMessage("Restaurant name is required"),
    body("city").isString().notEmpty().withMessage("city name is required"),
    body("country").isString().notEmpty().withMessage("country name is required"),
    body("deliveryPrice").isFloat({min: 0}).withMessage("Delivery price must be a positive number"),
    body("estimatedDeliveryTime").isInt({min: 0}).withMessage("Estimated delivery time must be a positive integar"),
    body("cuisines").isArray().withMessage("Cuisines must be an array").not().isEmpty().withMessage("cuisines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price").isFloat({min:0}).withMessage("Menu item price is required and must be a positive number"),
    handleValidationErrors
]