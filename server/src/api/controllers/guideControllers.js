/**
 * @file        createGuideController.js
 * @description Controller for creating a new guide.
 *              Delegates business logic to CreateGuideUseCase.
 *              Only accessible to Admins or Super Admins.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 */

import CreateGuideUseCase from "../../core/usecases/Guide/GuideCreateUseCase.js";
import UpdateGuideUseCase from "../../core/usecases/Guide/GuideUpdateUseCase.js";
import GuideDeleteUseCase from "../../core/usecases/Guide/GuideDeleteUseCase.js";
import GuideReadUseCase from "../../core/usecases/Guide/GuideReadUseCase.js";
import GuideRepository from "../../repositories/guideRepository.js";
import supabase from "../../config/supabase.js";
// Initialize repository and use case
const guideRepo = new GuideRepository(supabase);

/**
 * @function createGuideController
 * @description Handles HTTP request for creating a new guide.
 *              Validates admin role (middleware), calls use case, and returns created guide data.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Logged-in admin performing the action
 * @param {Object} req.body - Incoming JSON body with guide data
 * @param {Object} res - Express response object
 */
export const createGuideController = async (req, res) => {
  const createGuideUseCase = new CreateGuideUseCase(guideRepo);
  try {
    const admin = req.user; // set by JWT middleware
    const guideData = req.body;

    const result = await createGuideUseCase.execute(admin, guideData);

    return res.status(201).json({
      status: "success",
      data: result.database,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: err.errors || {},
      message: err.message || "Internal Server Error",
    });
  }
};

/**
 * @function updateGuideController
 */
export const updateGuideController = async (req, res) => {
  const updateGuideUseCase = new UpdateGuideUseCase(guideRepo);
  try {
    const admin = req.user; // JWT middleware

    const guideId = req.params.id; // guide ID from route param
    const guideData = req.body;
    const result = await updateGuideUseCase.execute(admin, guideId, guideData);

    return res.status(200).json({
      status: "success",
      data: result.database,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: err.errors || {},
      message: err.message || "Internal Server Error",
    });
  }
};

export const deleteGuideController = async (req, res) => {
  const guideDeleteUseCase = new GuideDeleteUseCase(guideRepo);
  try {
    const admin = req.user;
    const guideId = req.params.id;

    const result = await guideDeleteUseCase.execute(admin, guideId);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Internal Server Error",
    });
  }
};

export const readGuideController = async (req, res) => {
  const readUseCase = new GuideReadUseCase(guideRepo);

  try {
    const single = !!req.params.id; //     not(not(null)) = not(true) = false (faster way to check :D)
    const id = req.params.id ? Number(req.params.id) : null;

    const result = await readUseCase.execute({ single, id });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Internal Server Error",
    });
  }
};
