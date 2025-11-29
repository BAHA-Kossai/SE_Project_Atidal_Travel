import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import PagePath from "../components/PagePath.jsx";
import SearchBar from "../components/SearchBar.jsx";
import {useState} from "react";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import Table from "../components/Table.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import FileDropzone from "../components/FileDropzone.jsx";

export default function AdminGuidedTripsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuidedTrip, setSelectedGuidedTrip] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [selectedAgendaFile, setSelectedAgendaFile] = useState();


    const [guidedTrips, setGuidedTrips] = useState([
            {
                trip_id: 1,
                created_by: "Mohamed",
                created_at: "2025-02-14T13:45:30.123+00:00",
                available_seats: 24,
                destination: {
                    city: "Algiers",
                    country: "Algeria"
                },
                description: "lorem",
                imageURL: "https://ibnbattutatravel.com/wp-content/uploads/listing-images/ibnbattuta-tfXoMXA-EqM2l-dz2.jpg"
            },

            {
                trip_id: 2,
                created_by: "Sara",
                created_at: "2025-03-02T09:12:10.520+00:00",
                available_seats: 18,
                destination: {
                    city: "Oran",
                    country: "Algeria"
                },
                description: "Weekend getaway to the coastal city of Oran.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Oran_Cityscape.jpg/640px-Oran_Cityscape.jpg"
            },

            {
                trip_id: 3,
                created_by: "Yacine",
                created_at: "2025-01-22T16:20:45.842+00:00",
                available_seats: 30,
                destination: {
                    city: "Constantine",
                    country: "Algeria"
                },
                description: "Explore the iconic hanging bridges of Constantine.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Constantine_Suspension_Bridge.jpg"
            },

            {
                trip_id: 4,
                created_by: "Imane",
                created_at: "2025-04-10T11:00:00.000+00:00",
                available_seats: 12,
                destination: {
                    city: "Tlemcen",
                    country: "Algeria"
                },
                description: "Discover the historic palaces and waterfalls of Tlemcen.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tlemcen_waterfall_El_Ourit.jpg"
            },

            {
                trip_id: 5,
                created_by: "Khaled",
                created_at: "2025-02-28T07:34:11.200+00:00",
                available_seats: 20,
                destination: {
                    city: "Annaba",
                    country: "Algeria"
                },
                description: "A relaxing trip to the beaches and basilicas of Annaba.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Annaba_coast.jpg"
            },

            {
                trip_id: 6,
                created_by: "Nadia",
                created_at: "2025-03-18T14:15:50.003+00:00",
                available_seats: 8,
                destination: {
                    city: "Ghardaïa",
                    country: "Algeria"
                },
                description: "Experience the beauty of the M'zab Valley in Ghardaïa.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Ghardaia_panorama.jpg"
            },

            {
                trip_id: 7,
                created_by: "Amir",
                created_at: "2025-01-05T10:50:21.723+00:00",
                available_seats: 15,
                destination: {
                    city: "Bejaïa",
                    country: "Algeria"
                },
                description: "Hiking trip to the stunning Yemma Gouraya mountain.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/4/43/Yemma_Gouraya_Bejaia.jpg"
            },

            {
                trip_id: 8,
                created_by: "Rania",
                created_at: "2025-04-01T19:30:00.555+00:00",
                available_seats: 10,
                destination: {
                    city: "Setif",
                    country: "Algeria"
                },
                description: "Visit the archaeological sites and lively city streets of Setif.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Setif_Fountain.jpg"
            },

            {
                trip_id: 9,
                created_by: "Omar",
                created_at: "2025-03-25T06:05:10.100+00:00",
                available_seats: 28,
                destination: {
                    city: "Tizi Ouzou",
                    country: "Algeria"
                },
                description: "Discover the Kabyle culture and the Djurdjura mountains.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Tizi_Ouzou.jpg"
            },

            {
                trip_id: 10,
                created_by: "Lina",
                created_at: "2025-02-12T22:18:40.980+00:00",
                available_seats: 6,
                destination: {
                    city: "Biskra",
                    country: "Algeria"
                },
                description: "Enjoy the warm desert oasis and palm groves of Biskra.",
                imageURL: "https://upload.wikimedia.org/wikipedia/commons/2/21/Biskra_desert.jpg"
            }
        ]
    );
    const currentGuidedTrips = guidedTrips.filter(guidedTrip => {
        const query = searchQuery.toLowerCase();
        return (
            guidedTrip.created_by.toLowerCase().includes(query) ||
            guidedTrip.destination.city.toLowerCase().includes(query) ||
            guidedTrip.destination.country.toLowerCase().includes(query)
        );
    })
    const handleDelete = (id) => {
        setGuidedTrips(guidedTrips.filter(booking => booking["trip_id"] !== id));
        setIsDeleteModalOpen(false);
    };
    return (
        <AppBarSideBarWithContent>

            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Guided Trips
                </h1>
                <PagePath pathItems={["Dashboard", "Guided Trips"]}/>
            </div>
            <WhiteContainer>
                {/* Search / Sort / Filter/ New Guided Trip */}
                <div className="flex flex-row justify-between items-center mb-5">
                    <SearchBar
                        placeholder={"Search for a guided trip"}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        searchQuery={searchQuery}
                    />
                    <div className="flex flex-row justify-between w-100">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                            New Guided Trip
                            <Plus size={22} className={"ml-2"}/></ButtonFill>
                    </div>
                </div>

                {/* Table */}
                <Table
                    onDelete={
                        (trip) => {
                            setSelectedGuidedTrip(trip);
                            setIsDeleteModalOpen(true);
                        }
                    }
                    columns={[
                        {
                            title: "Trip ID",
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["trip_id"]}
                                </td>
                            )
                        },
                        {
                            title: "Destination Country & City",
                            format: (item) => (
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
                            )
                        },
                        {
                            title: "Created By",
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item["created_by"]}</td>
                            )
                        },
                        {
                            title: "Created At",
                            format: (item) => {
                                const isoString = item["created_at"]
                                const dateTime = new Date(isoString)
                                return (
                                    <td className={"text-gray-400 text-left"}>
                                        {dateTime.toLocaleDateString()} at {dateTime.toLocaleTimeString()}
                                    </td>
                                )
                            }
                        },
                        {
                            title: "Available Seats",
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item["available_seats"]}</td>
                            )
                        }
                    ]}
                    data={currentGuidedTrips}
                />
            </WhiteContainer>

            {/* Add Modal */}
            <ModalDialog
                open={isAddModalOpen}
                className={"overflow-y-scroll"}
            >
                {/* Image Dropzone */}
                <FileDropzone
                    accept={"image/*"}
                    height={"150"}
                    selectedFile={selectedImage}
                    setSelectedFile={setSelectedImage}
                    placeholderText={"Drop an image, or browse"}
                />

                <div className={"grid grid-cols-2 gap-4 my-8"}>
                    <InputField label={"Destination Country"}/>
                    <InputField label={"Destination City(ies)"}/>
                    <InputField label={"Description"}/>
                    <InputField label={"Available Seats"} type={"number"}/>
                    <InputField label={"Guided Trip Type"} type={"select"} options={["Umrah", "Normal"]}/>
                    <InputField label={"Guide Name"}/>
                </div>

                {/* Agenda Dropzone */}
                <FileDropzone
                    accept={"application/pdf"}
                    height={100}
                    selectedFile={selectedAgendaFile}
                    setSelectedFile={setSelectedAgendaFile}
                    placeholderText={"Drop agenda file, or browse"}
                />

                {/* Add/Cancel Buttons */}
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonOutline onClick={() =>
                    {
                        setIsAddModalOpen(false)
                        setSelectedImage(null)
                        setSelectedAgendaFile(null)
                    }
                    }>Cancel</ButtonOutline>
                    <ButtonFill>Add guided trip</ButtonFill>
                </div>
            </ModalDialog>

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the booking with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedGuidedTrip?.["trip_id"]}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedGuidedTrip?.["trip_id"])}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}