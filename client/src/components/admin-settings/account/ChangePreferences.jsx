import {ChevronDown} from "lucide-react";
import ButtonOutline from "../../ButtonOutline.jsx";
import Setting from "../Setting.jsx";

export default function ChangePreferences() {
    return (
        // Container
        <main className="h-43 flex flex-col justify-between relative bg-white font-normal mt-5 bg-whie border-2 border-gray-200 p-5 rounded-3xl">
            {/* Preferences */}
            <Setting
                title={"Change Language"}
                description={"changing the language will take a few seconds"}
                button={
                    <ButtonOutline width={50}>
                        English
                        <ChevronDown size={20} className="ml-2"/>
                    </ButtonOutline>
                }
            />
            <Setting
                title={"Change Appearance"}
                description={"you have the choice between light and dark mode"}
                button={
                    <ButtonOutline width={50}>
                        Light
                        <ChevronDown size={20} className="ml-2"/>
                    </ButtonOutline>
                }
            />
        </main>
    )
}