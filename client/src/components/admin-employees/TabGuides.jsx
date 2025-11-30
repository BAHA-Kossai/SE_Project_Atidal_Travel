import InputField from "../InputField.jsx";
import {useEffect, useState} from "react";
import Table from "../Table.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import ButtonFill from "../ButtonFill.jsx";
import WhiteContainer from "../WhiteContainer.jsx";
import TableEntryModal from "../TableEntryModal.jsx";
import ModalDialog from "../ModalDialog.jsx";



let initialGuides = [
    {
        guide_id: 2,
        created_at: new Date().toISOString(),
        first_name: "John",
        last_name: "Doe",
        phone: "0123456789",
        experience: "lorem ipsum dolor sit amet, consetetur adipiscing elit, sed do eiusmod",
        birth_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
]

export default function TabGuides() {
    const [guides, setGuides] = useState(initialGuides);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuide, setSelectedGuide] = useState({});
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        experience: "",
        birth_date: new Date().toISOString(),
    });
    useEffect(() => {
        if (selectedGuide && selectedGuide.first_name) {
            setFormData({
                first_name: selectedGuide.first_name,
                last_name: selectedGuide.last_name,
                phone: selectedGuide.phone,
                experience: selectedGuide.experience,
                birth_date: selectedGuide.birth_date,
            });
        }
    }, [selectedGuide, isEditModalOpen]);

    const filteredGuides = guides.filter(
        guide => {
            const query = searchQuery.toLowerCase()
            return (
                guide.first_name.toLowerCase().includes(query.toLowerCase()) ||
                guide.last_name.toLowerCase().includes(query.toLowerCase()) ||
                guide.phone.toLowerCase().includes(query.toLowerCase())
            )
        })

    const handleDelete = (id) => {
        setGuides(guides.filter(guide => guide.guide_id !== id));
        setIsDeleteModalOpen(false);
    }



    return (
        <>
            <WhiteContainer>
                <div className="flex flex-col">
                    {/* Search / Sort / Filter/ New Guide */}
                    <div className="flex flex-row justify-between items-center mb-5">
                        <SearchBar
                            placeholder={"Search for a guide"}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            searchQuery={searchQuery}
                        />
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                                New Guide
                                <Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                </div>
            <Table
                onSelect={
                    (guide) =>
                    {
                        setSelectedGuide(guide)
                        setIsEntryModalOpen(true)
                    }
                }
                onEdit={
                    (guide) =>
                    {
                        setSelectedGuide(guide)
                        setIsEditModalOpen(true)
                    }
                }
                onDelete={
                    (guide) =>
                    {
                        setSelectedGuide(guide)
                        setIsDeleteModalOpen(true)
                    }
                }
                columns={[
                    {
                        title: "ID",
                        format: (item) => (
                            <td key={item.guide_id} className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                {item.guide_id}
                            </td>
                        )
                    },
                    {
                        title: "First Name",
                        format: (item) => (
                            <td key={item.guide_id} className={"text-center text-gray-400"}>
                                {item.first_name}
                            </td>
                        )
                    },
                    {
                        title: "Last Name",
                        format: (item) => (
                            <td key={item.guide_id} className={"text-center text-gray-400"}>
                                {item.last_name}
                            </td>
                        )
                    },
                    {
                        title: "Phone Number",
                        format: (item) => (
                            <td key={item.guide_id} className={"text-center text-gray-400"}>
                                {item.phone}
                            </td>
                        )
                    },
                    {
                        title: "Birth Date",
                        format: (item) => (
                            <td key={item.guide_id} className={"text-center text-gray-400"}>
                                {new Date(item.birth_date).toLocaleDateString()}
                            </td>
                        )
                    },
                ]}
                data={filteredGuides}
                />
            </WhiteContainer>

            {/* Row Entry Modal */}
            <TableEntryModal
                title={"Guide Information"}
                open={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                properties={
                    [
                        {
                            name: "Guide ID",
                            value: selectedGuide?.guide_id
                        },
                        {
                            name: "Creation Date",
                            value: new Date(selectedGuide?.created_at).toLocaleDateString(),
                        },
                        {
                            name: "Creation Time",
                            value: new Date(selectedGuide?.created_at).toLocaleTimeString(),
                        },
                        {
                            name: "Phone Number",
                            value: selectedGuide.phone,
                        },
                        {
                            name: "Experience",
                            value: selectedGuide.experience,
                        },
                        {
                            name: "Birth Date",
                            value: new Date(selectedGuide.birth_date).toLocaleDateString(),
                        },
                    ]
                }
            />

            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Guide ${selectedGuide?.guide_id}`}
                open={isEditModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"First name"}
                        disabled={false}
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                    <InputField
                        label={"Last name"}
                        disabled={false}
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                    <InputField
                        label={"Phone number"}
                        disabled={false}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <InputField
                        label={"Experience"}
                        disabled={false}
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                    <InputField
                        label={"Birth date"}
                        type={"date"}
                        disabled={false}
                        value={new Date(formData.birth_date).toISOString().split("T")[0]}
                        onChange={(e) => setFormData({...formData, birth_date: new Date(e.target.value).toISOString()})}
                    />
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-4"}
                >
                    <ButtonFill>Edit Guide</ButtonFill>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
                </div>
            </ModalDialog>

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the guide with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedGuide?.guide_id}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedGuide?.guide_id)}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>

        </>
    )
}
