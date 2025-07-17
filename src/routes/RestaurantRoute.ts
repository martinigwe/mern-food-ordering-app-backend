import  express  from "express"
import { param } from "express-validator"
import RestuarantController from "../controllers/RestuarantController"

const router = express.Router()

router.get("/:restaurantId", param("restaurantId").isString().trim().notEmpty().withMessage("restauranId parameter must be a string"),
    RestuarantController.getRestaurant
)

router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a string"),
    RestuarantController.searchRestaurants
)

export default router;