import  express  from "express"
import { param } from "express-validator"
import RestaurantController from "../controllers/RestaurantController"

const router = express.Router()

router.get("/:restaurantId", param("restaurantId").isString().trim().notEmpty().withMessage("restauranId parameter must be a string"),
    RestaurantController.getRestaurant
)

router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a string"),
    RestaurantController.searchRestaurants
)

export default router;