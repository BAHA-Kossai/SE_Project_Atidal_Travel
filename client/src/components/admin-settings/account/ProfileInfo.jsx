import {Edit} from "lucide-react";
import "../../../styles/admin_settings.css"


export default function ProfileInfo() {
    return (
        <main className="relative bg-white font-normal mt-5 bg-whie border-2 border-gray-200 p-5 rounded-3xl">
            <div className={"text-[20px] mb-4"}>Profile Information</div>

            <div className={"flex flex-row items-center mb-5"}>
                <div className="profile-photo">
                    K
                    <div className={"p-1 absolute right-0 bottom-1 text-cyan-500 bg-blue-100 rounded-full"}>
                        <Edit size={16} />
                    </div>
                </div>
                <div className="ml-10">
                    <div>User Name</div>
                    <div className={"text-gray-400"}>email@gmail.com</div>
                </div>
            </div>

            {/* Input Fields Grid */}
            <div className={"grid grid-cols-2 gap-4 mb-6"}>
                <InputField label="Firstname" value={"Abderrahim"}/>
                <InputField label="Lastname" value={"Khefif"}/>
                <InputField label="Phone Number" value={"+213 555 555 555"}/>
                <InputField label="Address" value={"****, Algiers, Algeria"}/>
            </div>

            <button className={"edit-profile-btn"}>
                Edit Profile
                <Edit size={15} className={"ml-2"}/>
            </button>
        </main>
    )
}

const InputField = ({label, value}) => {
    return (
        <main className="flex flex-col text-gray-700">
            <label className={"mb-2 font-semibold"}>{label}</label>
            <input type="text" disabled={true} value={value} className={"border-1 py-2 px-6 border-gray-500 rounded-lg"}/>
        </main>
    )
}
