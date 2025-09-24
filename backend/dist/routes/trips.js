"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/trips.ts
const express_1 = require("express");
const tripController_1 = require("../controllers/tripController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/v1/trips/stats - Esta ruta ahora requiere un token
router.get('/stats', auth_1.authenticate, tripController_1.getTripStats);
exports.default = router;
//# sourceMappingURL=trips.js.map