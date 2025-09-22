"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = require("../controllers/tripController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.rateLimitByUser)(50, 15 * 60 * 1000));
router.get('/stats', tripController_1.getTripStats);
exports.default = router;
//# sourceMappingURL=trips.js.map