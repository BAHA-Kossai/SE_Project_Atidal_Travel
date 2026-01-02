import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import PagePath from "../components/PagePath.jsx";
import SearchBar from "../components/SearchBar.jsx";
import {useState, useEffect} from "react";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import Table from "../components/Table.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import FileDropzone from "../components/FileDropzone.jsx";
import TableEntryModal from "../components/TableEntryModal.jsx";
import { useGuidedTrips } from "../../hooks/useGuidedTrips.js";
import { API_BASE } from "../../config/env.js";

const trip_type = Object.freeze({
    NORMAL: "Normal",
    UMRAH: "Umrah"
})

export default function AdminGuidedTripsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuidedTrip, setSelectedGuidedTrip] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Use the API hook
    const { trips, loading, error, refetch } = useGuidedTrips();

    // Helper to get image URL
    const getImageUrl = (trip) => {
        if (trip.image_path) {
            return trip.image_path.startsWith('http') 
                ? trip.image_path 
                : `${API_BASE}${trip.image_path}`;
        }
        if (trip.trip_info?.image_path) {
            return trip.trip_info.image_path.startsWith('http')
                ? trip.trip_info.image_path
                : `${API_BASE}${trip.trip_info.image_path}`;
        }
        return trip.imageURL || '';
    };

    // Helper to get destination info
    const getDestination = (trip) => {
        if (trip.trip_info) {
            return {
                country: trip.trip_info.destination_country || '',
                city: trip.trip_info.destination_city || ''
            };
        }
        return trip.destination || { country: '', city: '' };
    };

    const currentGuidedTrips = trips.filter(trip => {
        const query = searchQuery.toLowerCase();
        const destination = getDestination(trip);
        return (
            (trip.created_by || '').toLowerCase().includes(query) ||
            destination.city.toLowerCase().includes(query) ||
            destination.country.toLowerCase().includes(query) ||
            (trip.description || '').toLowerCase().includes(query)
        );
    });
    return (
        <AppBarSideBarWithContent>

            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Guided Trips
                </h1>
                <PagePath pathItems={["Dashboard", "Guided Trips"]}/>
            </div>
            <WhiteContainer>
                {/* Search / Sort / Filter */}
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
                         <ButtonFill onClick={() => setIsAddModalOpen(true)}>New guided trip<Plus size={22} className={"ml-2"}/></ButtonFill>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading guided trips...</p>
                    </div>
                ) : (
                    /* Table */
                    <Table
                    onSelect={(trip) => {
                        setSelectedGuidedTrip(trip);
                        setIsEntryModalOpen(true);
                    }}
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
                                                <img src={getImageUrl(item)} width={40} height={40} alt="trip" className="object-cover rounded"/>
                                            </div>

                                            <div className={"flex flex-col items-start gap-3"}>
                                                <div className="text-gray-700 font-medium">{getDestination(item).country}</div>
                                                <div className="text-(--color-text-secondary) text-sm cursor-pointer">{getDestination(item).city}</div>
                                            </div>

                                        </div>
                                    </td>
                                </>
                            )
                        },
                        {
                            title: "Trip Type",
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{tripTypeWidget(item.type || trip_type.NORMAL)}</td>
                            )
                        },
                        {
                            title: "Created By",
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item.created_by || 'N/A'}</td>
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
                                <td className={"text-gray-400 text-left"}>{item.available_seats || 0}</td>
                            )
                        }
                    ]}
                    data={currentGuidedTrips}
                />
                )}
            </WhiteContainer>


            {/* Row Entry Modal */}
            <TableEntryModal
                title={"Guided Trip Information"}
                open={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                properties={[
                    {
                        name: "Trip ID",
                        value: selectedGuidedTrip?.trip_id,
                    },
                    {
                        name: "Created By",
                        value: selectedGuidedTrip?.created_by,
                    },
                    {
                        name: "Creation Date",
                        value: new Date(selectedGuidedTrip?.created_at).toLocaleDateString(),
                    },
                    {
                        name: "Creation Time",
                        value: new Date(selectedGuidedTrip?.created_at).toLocaleTimeString(),
                    },
                    {
                        name: "Description",
                        value: selectedGuidedTrip?.description,
                    },
                    {
                        name: "Trip Type",
                        value: selectedGuidedTrip?.type || 'Normal',
                    },
                    {
                        name: "Available Seats",
                        value: selectedGuidedTrip?.available_seats || 0,
                    },
                    {
                        name: "Description",
                        value: selectedGuidedTrip?.description || 'N/A',
                    },
                ]}
            />

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Note: Guided trips are read-only. Delete functionality is not available.
                    </h1>
                </div>
                <div className={"grid grid-cols-1 gap-4 mt-8"}>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>Close</ButtonOutline>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}


const tripTypeWidget = (type) => {
    let foregroundColor = ""
    let backgroundColor = ""
    let text = ""
    const normalizedType = type?.toLowerCase() || 'normal';
    switch (normalizedType) {
        case 'normal':
        case 'guided_trip':
            foregroundColor = "green-600"
            backgroundColor = "green-100"
            text = "Normal"
            break
        case 'umrah':
            foregroundColor = "amber-600"
            backgroundColor = "amber-100"
            text = "Umrah"
            break
        default:
            foregroundColor = "gray-600"
            backgroundColor = "gray-100"
            text = normalizedType
    }


    return (
        <div className={`
            flex flex-row px-4 justify-center items-center
            h-10 text-sm
            text-${foregroundColor}
            bg-${backgroundColor}
            rounded-full
       `}>
            <div className={`rounded-xl w-2 h-2 bg-${foregroundColor} mr-2`}></div>
            {text}
        </div>
    )
}
