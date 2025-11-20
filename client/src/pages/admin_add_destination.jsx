import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import PagePath from "../components/PagePath.jsx";
import InputField from "../components/InputField.jsx";
import {UploadCloud, UploadIcon} from "lucide-react";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";

export default function AdminAddDestination() {

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Add a destination
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Destinations", "Add a destination"]}/>
            </div>

            <WhiteContainer title={"Add new destination"}>

                <div className={"flex flex-row justify-around"}>

                    {/* Upload Image */}
                    <div className="border-4 border-dashed border-(--color-primary) rounded-2xl cursor-pointer"
                         style={{
                             backgroundColor: "#f4f8fb",
                             borderColor: "#669bbc",
                         }}
                    >
                        <div className={"flex flex-col items-center p-8"}>
                            <UploadCloud size={140} className={"text-(--color-primary)"}
                                         style={{
                                             color: "#669bbc",
                                         }}/>
                            <div className={"flex flex-row items-center"}>
                                <UploadIcon className={"mr-2"}
                                            style={{
                                                color: "#669bbc",
                                            }}
                                />
                                Drop your files, or Browse
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <InputField label={"Destination Country"} fieldMaxWidth={200}/>
                            <InputField label={"Destination City(ies)"}/>
                            <InputField label={"First name"}/>
                        </div>
                        <div className={"flex flex-row"}>
                            <ButtonOutline>Cancel</ButtonOutline>
                            <ButtonFill>Add destination</ButtonFill>
                        </div>
                    </div>
                </div>
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}
