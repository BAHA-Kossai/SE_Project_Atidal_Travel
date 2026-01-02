import "../../styles/admin_settings.css"
import { useState } from "react";
import WhiteContainer from "../WhiteContainer.jsx";
import ButtonFill from "../ButtonFill.jsx";
import {useAuthHandlers} from "../../../hooks/useAuthHandlers.js";


export default function ProfileInfo_test() {
    const { handleSignOut } = useAuthHandlers();

    const userData = localStorage.getItem("user");
    const storedProfile = userData ? JSON.parse(userData) : null;

    const getProfileData = () => {
        if (!storedProfile) {
            return {
                email: "",
                first_name: "",
                last_name: "",
                phone: "",
                date_of_birth: "",
            };
        }

        if (storedProfile.supabase && storedProfile.database) {
            return {
                email: storedProfile.supabase.email,
                first_name: storedProfile.supabase.first_name,
                last_name: storedProfile.supabase.last_name,
                phone: storedProfile.database.phone,
                date_of_birth: storedProfile.supabase.date_of_birth,
                user_id: storedProfile.database.id,
                supabase_id: storedProfile.database.supabase_id
            };
        } else if (storedProfile.email) {
            return {
                email: storedProfile.email,
                first_name: storedProfile.first_name,
                last_name: storedProfile.last_name,
                phone: storedProfile.phone,
                date_of_birth: storedProfile.date_of_birth,
                user_id: storedProfile.user_id || storedProfile.id
            };
        } else {
            return storedProfile;
        }
    };

    const [profileData] = useState(getProfileData());

    return (
        <main className={"mt-5"}>

            {/* Profile Section */}
            <WhiteContainer title={"Profile Information"}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "4rem", height: "4rem", backgroundColor: "#117BB8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
                            {/*{getUserInitials()}*/}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#212529", margin: "0" }}>
                                {profileData?.first_name || 'User'} {profileData?.last_name || ''}
                            </h2>
                            <p style={{ fontSize: "0.875rem", color: "#495057", margin: "0" }}>
                                {profileData?.email || 'No email'}
                            </p>
                        </div>
                    </div>
                    <ButtonFill
                        onClick={handleSignOut}
                    >
                        Sign out
                    </ButtonFill>
                </div>

                {/* Profile Info Display (Read-only) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                                First name
                            </label>
                            <div style={{
                                width: "100%",
                                padding: "0.625rem 1rem",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.5rem",
                                fontSize: "1rem",
                                color: "#212529",
                                backgroundColor: "#f8f9fa",
                            }}>
                                {profileData?.first_name || 'Not provided'}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                                Last name
                            </label>
                            <div style={{
                                width: "100%",
                                padding: "0.625rem 1rem",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.5rem",
                                fontSize: "1rem",
                                color: "#212529",
                                backgroundColor: "#f8f9fa",
                            }}>
                                {profileData?.last_name || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                                Phone number
                            </label>
                            <div style={{
                                width: "100%",
                                padding: "0.625rem 1rem",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.5rem",
                                fontSize: "1rem",
                                color: "#212529",
                                backgroundColor: "#f8f9fa",
                            }}>
                                {profileData?.phone || 'Not provided'}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                                Birth date
                            </label>
                            <div style={{
                                width: "100%",
                                padding: "0.625rem 1rem",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.5rem",
                                fontSize: "1rem",
                                color: "#212529",
                                backgroundColor: "#f8f9fa",
                            }}>
                                {profileData?.date_of_birth || 'Not provided'}
                            </div>
                        </div>
                    </div>
                </div>
            </WhiteContainer>
        </main>
    )
}

