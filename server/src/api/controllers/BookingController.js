import AssignBranchUseCase from "../../core/usecases/Booking/AssignBranchUseCase.js";
import BookingsRepository from "../../repositories/BookingsRepository.js";
import BranchRepository from "../../repositories/branchRepository.js";
import supabase from '../../config/supabase.js';
const bookingsRepository = new BookingsRepository(supabase);
const branchRepository = new BranchRepository(supabase);

export const assignBranchController = async (req, res) => {
  try {
    const authUser = req.user;
    const { booking_id, branch_id } = req.body;

    if (!booking_id || !branch_id) {
      return res.status(400).json({
        status: "error",
        data: {},
        message: "booking_id and branch_id are required"
      });
    }

    const useCase = new AssignBranchUseCase(bookingsRepository, branchRepository);
    const result = await useCase.execute(authUser, booking_id, branch_id);

    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong"
    });
  }
};
