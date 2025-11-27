import UserRepository from './src/repositories/userRepository.js'
import SignUpUseCase from "./src/core/usecases/SignUpUseCase.js";
import LoginUseCase from "./src/core/usecases/LoginUseCase.js";
import AdminManagementUseCase from "./src/core/usecases/AdminManagementUseCase.js";
import {supabaseAdmin} from "./src/config/supabase.js"; // your supabase client
import { hashPassword } from "./src/utils/formValidation.js";

async function superAdminFlow() {
  const userRepo = new UserRepository(supabaseAdmin);

  // 1️⃣ Create Super Admin (only once)
  const superAdminData = {
    email: "superadmin@example.com",
    password: "SuperAdmin@123", // valid password
    first_name: "Super",
    last_name: "Admin",
    phone: "+213123456789",
    date_of_birth: "1990-01-01"
  };

  let superAdmin;
  try {
    superAdmin = await userRepo.registerSuperAdmin(superAdminData);
    console.log("Super Admin created:", superAdmin);
  } catch (err) {
    if (err.status === 409) {
      console.log("Super Admin already exists, fetching...");
      // Fetch Super Admin from DB
      const existing = await userRepo.findByEmail(superAdminData.email);
      superAdmin = {
        database: existing,
        supabase: { id: existing.supabase_id, email: existing.email }
      };
    } else {
      console.error(err);
      return;
    }
  }

  // 2️⃣ Login as Super Admin
  const loginUseCase = new LoginUseCase(userRepo);
  const loginResponse = await loginUseCase.loginWithEmail({
    email: superAdminData.email,
    password: superAdminData.password
  });

  console.log("Super Admin logged in:", loginResponse.user);

  // 3️⃣ Create a regular user via Super Admin
  const adminUseCase = new AdminManagementUseCase(userRepo);
  const newUserData = {
    email: "user1@example.com",
    password: "User@12345",
    first_name: "Normal",
    last_name: "User",
    phone: "+213987654321",
    date_of_birth: "2000-05-05"
  };

  const createdUser = await adminUseCase.createAdmin(loginResponse.user, newUserData); // you can change to createRegularUser logic if you want regular users
  console.log("User created by Super Admin:", createdUser);
}

superAdminFlow().catch(console.error);
