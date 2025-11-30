import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import mock_destinations from '../mock-destinations.json'
import {useState} from "react";
import PagePath from "../components/PagePath.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import FileDropzone from "../components/FileDropzone.jsx";
import TableEntryModal from "../components/TableEntryModal.jsx";


const initialDestinations = [
    {
        destination_id :1,
        destination_country: "Sri Lanka",
        destination_city: "Mulleriyawa",
        created_by: "Cynthea",
        created_at: {
            date: "24-03-2025",
            time: "12:19 PM"
        },
        description: "some description",
        imageURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHpSURBVDjLhZNbbxJhEIb3T/RWw78g2fjLvLE2ppe1TYNtvGuNRo6BcA4kIBBOgXCU3QXploCAmNQE/VY55PWbj7CWcPBibuab95l3ZmelZrOJRqOBWq2GarWKSqWCcrmMUqmEYrF4BEA6FFK9XsdyudyKfr8vILlc7iBEos4k6PV6orOu6yaEctwF0un0XohElqmYulGiUCiUptMp5vO5yBMwm80ikUjshEjUdV3IxX+45Z5hGPj29RcykbF463a7SKVSiMfjWxCJOq8tLxYLkPj72MCbEw3nz1WkwytIp9MhF4hEIhsQic/IJpOJKJrNZqKz7aWGm7Mu3l/quDppmxBN08gFAoGACZHy+fwzPiMbj1dFSvVBdL49v8PHq/stiKqq5AJer1dABCWTych8RjYajURRu/EDtmMV7y7+QWzHGj4FV++tVotcwO12H5mzJJNJmc/IhsPhFuSDTcfb0w6uTz/zr7MQLkKhEJxO59ONjfL55FgsxgaDgQm5fKHg+lUbtxdt/Jwaj8UWc4THEY1G5XA4zOgSxeLqD7h5/QW/jbkpdjgcFnOJu44jGAzKfr+f0SWuPzGJeX5DvBdA4fP5rHzTjA5MUZSd4oMACo/HY3W5XIzEdrvdsvOU//e78q5WLn6y7/0viZYv/mL7AwwAAAAASUVORK5CYII="
    },
]

export default function AdminDestinationsPage() {
    // Modals
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState();
    const [destinations, setDestinations] = useState(initialDestinations);

    const handleEdit = () => {
        console.log("Editing Destination");
    }
    const handleDelete = () => {
        console.log("Delete Destination");
    }


    const [formData, setFormData] = useState({
        country: "",
        city: "",
        created_by: "",
        image: null
    })

    const filteredDestinations = destinations.filter(
        destinations => {
            const query = searchQuery.toLowerCase()
            return (
                destinations.destination_city.toLowerCase().includes(query) ||
                destinations.destination_country.toLowerCase().includes(query) ||
                destinations.created_by.toLowerCase().includes(query)
            )
        })

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
                        <SearchBar
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            searchQuery={searchQuery}
                            placeholder={"Search for an order"}/>
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => setIsAddModalOpen(true)}>New Destination<Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                    <Table
                        onSelect={
                            (destination) => {
                                setSelectedDestination(destination)
                                setIsEntryModalOpen(true)
                            }
                        }
                        onEdit={
                            (destination) => {
                                setSelectedDestination(destination)

                                setFormData({
                                    country: destination.destination_country,
                                    city: destination.destination_city,
                                    created_by: destination.created_by,
                                    image: destination.imageURL
                                })
                                setIsEditModalOpen(true)
                            }
                        }
                        onDelete={
                            (destination) => {
                                setSelectedDestination(destination)
                                setIsDeleteModalOpen(true)
                            }
                        }
                        columns={[
                            {
                                title : "Destination Country & City",
                                format: (item) =>
                                    <td className={"text-gray-400 text-center"}>
                                        <div className="flex items-center gap-3">

                                            {/* Avatar / Image placeholder */}
                                            <div className="w-10 h-10 bg-gray-100 rounded">
                                                <img src={item.imageURL} width={40} alt="img"/>
                                            </div>

                                            <div className={"flex flex-col items-start gap-3"}>
                                                <div className="text-gray-700 font-medium">{item.destination_country}</div>
                                                <div className="text-(--color-text-secondary) text-sm cursor-pointer">{item.destination_city}</div>
                                            </div>

                                        </div>
                                    </td>
                            },
                            {
                                title : "Created By",
                                format: (item) =>
                                    <td className={"text-gray-400 text-left"}>{item.created_by}</td>
                            },
                            {
                                title : "Created At",
                                format: (item) =>
                                    <td className={"text-gray-400 text-left"}>{item["created_at"]["date"]} at {item["created_at"]["time"]}</td>
                            },
                        ]}
                        data={filteredDestinations}
                    />
                </div>
            </WhiteContainer>


            {/* Entry Modal */}
            <TableEntryModal
                title={"Destination Information"}
                open={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                properties={
                [
                    {
                        name: "ID",
                        value: selectedDestination?.destination_id
                    },
                    {
                        name: "Description",
                        value: selectedDestination?.description
                    },
                    {
                        name: "Country",
                        value: selectedDestination?.destination_country
                    },
                    {
                        name: "City",
                        value: selectedDestination?.destination_city
                    },
                    {
                        name: "Creation Date",
                        value: selectedDestination?.created_at.date
                    },
                    {
                        name: "Creation Time",
                        value: selectedDestination?.created_at.time
                    },
                ]
                }
            />

            {/* Add Modal */}
            <ModalDialog
                title={"New Destination"}
                description={"Add a new destination to the agency"}
                open={isAddModalOpen}
                className={"overflow-y-scroll"}
            >
                <div className={"flex flex-col justify-center p-5"}>

                    {/* Upload Image */}
                    <FileDropzone
                        accept={"image/*"}
                        height={"150"}
                        selectedFile={selectedImage}
                        setSelectedFile={setSelectedImage}
                        placeholderText={"Drop an image, or browse"}
                    />

                    <div className={"w-full flex flex-col justify-between mt-5"}>
                        <div className={"w-full grid grid-cols-2 gap-y-3 gap-x-6  justify-between items-center"}>
                            {/* Input Fields */}
                            <InputField label={"Destination Country"}/>
                            <InputField label={"Destination City(ies)"}/>
                            <InputField className={"col-span-2 mb-4"} label={"Description"}/>
                            {/* Action Buttons */}
                            <ButtonOutline onClick={() => {setIsAddModalOpen(false); setSelectedImage(null) }}>Cancel</ButtonOutline>
                            <ButtonFill>Add Destination</ButtonFill>
                        </div>
                        <div className={"flex flex-row justify-between"}>
                        </div>
                    </div>
                </div>
            </ModalDialog>


            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Destination ${selectedDestination?.destination_id}`}
                open={isEditModalOpen}
                className={"overflow-y-scroll"}
            >
                <div className={"grid grid-cols-2 gap-4 mb-5"}>
                    <InputField
                        label={"Destination Country"}
                        name={"destination_country"}
                    />
                    <InputField
                        label={"Destination City"}
                        name={"destination_city"}
                    />
                    <InputField
                        label={"Created By"}
                        name={"created_by"}
                    />
                </div>
                <FileDropzone
                    selectedFile={formData.image}
                    setSelectedFile={(value) => setFormData({...formData, image: value})}
                    />

                <div className={"grid grid-cols-2 gap-4 mt-4"}>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
                    <ButtonFill onClick={() => handleEdit()}>Edit destination</ButtonFill>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}