import express from 'express';
import authRouter from '../../modules/auth/router/auth.router.mjs';
import projectRouter from '../../modules/project/router/project.router.mjs';
import moduleRouter from '../../modules/module/router/module.router.mjs';
import metadataRouter from '../../modules/metadata/router/metadata.router.mjs';
import { JwtHelper } from '../../middlewares/jwtHelper.mjs';
import keyRatioFieldsRouter from '../../modules/keyRatioFields/router/keyRatioFields.router.mjs';
import compareRouter from '../../modules/compare/router/compare.router.mjs';
import CommercialKeyRatioRouter from '../../modules/commercialKeyRatio/router/commercialKeyRatio.router.mjs'

const router = express.Router();
const API_V1 = '/v1';

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/project`, JwtHelper.verifyToken, projectRouter);
router.use(`${API_V1}/module`, JwtHelper.verifyToken, moduleRouter);

// metadata route
router.use(`${API_V1}/metadata`, metadataRouter);
router.use(`${API_V1}/keyRatio`, keyRatioFieldsRouter)
router.use(`${API_V1}/compare`,JwtHelper.verifyToken, compareRouter)
router.use(`${API_V1}/commercial`, CommercialKeyRatioRouter)


export default router;
