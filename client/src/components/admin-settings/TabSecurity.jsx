import WhiteContainer from "../WhiteContainer.jsx";
import InputField from "../InputField.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import Setting from "./Setting.jsx";
import Switch from "../Switch.jsx";

export default function TabSecurity() {
    const fields = [
        {
            label: "Email",
            type: "text",
            value: "email@gmail.com",
            fieldMaxWidth: 100,
            buttonText: "Change Email"
        },
        {
            label: "Password",
            type: "password",
            value: "email@gmail.com",
            fieldMaxWidth: 100,
            buttonText: "Change Password"
        }
    ]

    return (
        <main className={"mt-5"}>
            <WhiteContainer title={"Security settings"}>
                {
                    fields.map((field, ) => {
                        return (
                            <div className={"flex flex-row justify-between items-end mb-5"}>
                                <InputField type={field.type} label={field.label} value={field.value} fieldMaxWidth={field.fieldMaxWidth}/>
                                <ButtonOutline children={field.buttonText}/>
                            </div>
                        )
                    })
                }

                <Setting
                    title={"2-Step Authentication"}
                    description={"add an additional layer of security to your account during login"}
                    button={<Switch/>}
                />
            </WhiteContainer>
        </main>
    )
}