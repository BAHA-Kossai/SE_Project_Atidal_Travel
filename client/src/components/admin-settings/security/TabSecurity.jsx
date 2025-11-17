import WhiteContainer from "../../WhiteContainer.jsx";
import InputField from "../../InputField.jsx";
import ButtonOutline from "../../ButtonOutline.jsx";
import Setting from "../Setting.jsx";
import Switch from "../../Switch.jsx";

export default function TabSecurity() {
    return (
        <WhiteContainer title={"Security settings"}>
            <div className={"flex flex-row justify-between items-end mb-5"}>
                <InputField label={"Email"} value={"email@gmail.com"}/>
                <ButtonOutline children={"Change Email"}/>
            </div>
            <div className={"flex flex-row justify-between items-end mb-5"}>
                <InputField type={"password"} label={"Password"} value={"email@gmail.com"}/>
                <ButtonOutline children={"Change Password"}/>
            </div>
            <Setting
                title={"2-Step Authentication"}
                description={"add an additional layer of security to your account during login"}
                button={<Switch/>}/>
        </WhiteContainer>
    )
}