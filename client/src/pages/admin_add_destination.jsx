import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import PagePath from "../components/PagePath.jsx";
import InputField from "../components/InputField.jsx";
import {UploadCloud, UploadIcon} from "lucide-react";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AdminAddDestination() {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState();

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

                <div className={"flex flex-row justify-start p-5"}>

                    {/* Upload Image */}
                    <label
                        className="
                         w-140 h-130 mr-10
                         content-center
                         border-4 border-dashed border-(--color-primary)
                         hover:bg-red-500
                         rounded-2xl relative cursor-pointer cover z-10 overflow-hidden"
                        style={{
                            backgroundColor: "#f4f8fb",
                            borderColor: "#669bbc",
                        }}
                    >
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            name="image-upload"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                // Only update the state if a real file (image) is selected
                                if (!file) return
                                setSelectedImage(file ? URL.createObjectURL(file) : null);
                            }}
                        />

                        {/* Show placeholder if no image is uploaded, else show the image */}
                        {
                            selectedImage ?
                                (
                                    <img className={"absolute w-full h-full inset-0 object-cover"}
                                        src={selectedImage}
                                        alt={"Preview Image"}
                                    />
                                ) : (
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
                                )
                        }
                    </label>

                    <div className={"w-full flex flex-col justify-between"}>
                        {/* Input Fields */}
                        <div>
                            <InputField className={"mb-5"} label={"Destination Country"}/>
                            <InputField className={"mb-5"} label={"Destination City(ies)"}/>
                            <InputField className={"mb-5"} label={"First name"}/>
                        </div>

                        {/* Action Buttons */}
                        <div className={"flex flex-row justify-end"}>
                            <ButtonOutline className={"mr-4 w-40"} onClick={() => navigate("/admin-destinations") }>Cancel</ButtonOutline>
                            <ButtonFill className={"w-40"}>Add destination</ButtonFill>
                        </div>
                    </div>
                </div>
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}
