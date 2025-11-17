import {ChevronDown} from "lucide-react";
import ButtonOutline from "../../ButtonOutline.jsx";

export default function ChangePreferences() {
    return (
        // Container
        <main className="h-43 flex flex-col justify-between relative bg-white font-normal mt-5 bg-whie border-2 border-gray-200 p-5 rounded-3xl">
            {/* Preferences */}
            <Preference title={"Change Language"} description={"changing the language will take a few seconds"} buttonText={"English"}/>
            <Preference title={"Change Appearance"} description={"you have the choice between light and dark mode"} buttonText={"Light"}/>
        </main>
    )
}

const Preference = ({title, description, buttonText}) => {
    return (
        <>
            <div className={"flex flex-row justify-between items-center"}>
                <div className="ml-3">
                    <div className={"text-[20px] font-normal"}>{title}</div>
                    <div className={"text-[15px] text-gray-500"}>{description}</div>
                </div>

                {/* Preference Button */}
                <ButtonOutline>
                    {buttonText}
                    <ChevronDown size={20} className="ml-2"/>
                </ButtonOutline>
            </div>
        </>
    )
}
