import { Router  } from "express";
import { registerUser ,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails} from "../controllers/user.controller.js";
import { addservice ,getAllservice} from "../controllers/service.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();
// User registration route

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)


//service routes
router.route("/add-service").post(verifyJWT,addservice);
router.route("/get-all-services").get(verifyJWT,getAllservice);

export default router;