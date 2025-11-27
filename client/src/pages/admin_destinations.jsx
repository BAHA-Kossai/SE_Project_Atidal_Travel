import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal, UploadCloud, UploadIcon} from "lucide-react";
import mock_destinations from '../mock-destinations.json'
import {useState} from "react";
import PagePath from "../components/PagePath.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";

export default function AdminDestinationsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Destinations
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Destinations"]}/>
            </div>

            <WhiteContainer>
                <div className="flex flex-col">
                    {/* Search / Sort / Filter/ New Destination */}
                    <div className="flex flex-row justify-between items-center mb-5">
                        <SearchBar placeholder={"Search for an order"}/>
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => setIsModalOpen(true)}>New Destination<Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                    <Table
                        columns={[
                            {
                                title : "Destination Country & City",
                                format: (item) =>
                                    <>
                                        <td className={"text-gray-400 text-center"}>
                                            <div className="flex items-center gap-3">

                                                {/* Avatar / Image placeholder */}
                                                <div className="w-10 h-10 bg-gray-100 rounded">
                                                    <img src={item["imageURL"]} width={40} alt="img"/>
                                                </div>

                                                <div className={"flex flex-col items-start gap-3"}>
                                                    <div className="text-gray-700 font-medium">{item["destination"]["country"]}</div>
                                                    <div className="text-(--color-text-secondary) text-sm cursor-pointer">{item["destination"]["city"]}</div>
                                                </div>

                                            </div>
                                        </td>
                                    </>
                            },
                            {
                                title : "Created By",
                                format: (item) =>
                                    <>
                                        {/* Created By */}
                                        <td className={"text-gray-400 text-left"}>{item["created_by"]}</td>
                                    </>
                            },
                            {
                                title : "Created At",
                                format: (item) =>
                                    <>
                                        {/* Created At */}
                                        <td className={"text-gray-400 text-left"}>{item["created_at"]["date"]} at {item["created_at"]["time"]}</td>
                                    </>
                            },
                        ]}
                        data={mock_destinations}
                    />
                </div>
            </WhiteContainer>


            <ModalDialog
                title={"New Destination"}
                description={"Add a new destination to the agency"}
                open={isModalOpen}
            >
                <div className={"flex flex-col justify-center p-5"}>

                    {/* Upload Image */}
                    <label
                        className="
                         w-full min-h-50
                         mb-7
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
                                    // Image
                                    <img className={"absolute w-full h-full inset-0  bg-green-200 object-scale-down"}
                                         src={selectedImage}
                                         alt={"Preview Image"}
                                    />
                                ) : (
                                    // Placeholder
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
                        <div className={"w-full grid grid-cols-2 gap-y-3 gap-x-6  justify-between items-center"}>
                            {/* Input Fields */}
                            <InputField label={"Destination Country"}/>
                            <InputField label={"Destination City(ies)"}/>
                            <InputField className={"col-span-2 mb-4"} label={"Description"}/>
                            {/* Action Buttons */}
                            <ButtonFill>Add destination</ButtonFill>
                            <ButtonOutline onClick={() => {setIsModalOpen(false); setSelectedImage(null) }}>Cancel</ButtonOutline>
                        </div>
                        <div className={"flex flex-row justify-between"}>
                        </div>
                    </div>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}