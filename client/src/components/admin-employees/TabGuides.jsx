import { useState, useEffect } from "react";
import WhiteContainer from "../WhiteContainer.jsx";
import ModalDialog from "../ModalDialog.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import ButtonFill from "../ButtonFill.jsx";
import Table from "../Table.jsx";
import { ArrowUpDown, Plus, SlidersHorizontal, X } from "lucide-react";
import InputField from "../InputField.jsx";
import TableEntryModal from "../TableEntryModal.jsx";

import { useGuideHandlers } from "../../../hooks/useGuidesHandlers.js";

export default function TabGuides() {
  const {
    guides,
    handleFetchGuides,
    handleCreateGuide,
    handleUpdateGuide,
    handleDeleteGuide,
    message,
  } = useGuideHandlers();

  useEffect(() => {
    handleFetchGuides().catch((err) => console.error(err));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    experiance: "",
    birth_date: new Date().toISOString(),
  });
  const [errorMessage, setErrorMessage] = useState("");

  const filteredGuides = guides.filter((guide) => {
    const query = searchQuery.toLowerCase();
    return (
      guide.first_name.toLowerCase().includes(query) ||
      guide.last_name.toLowerCase().includes(query) ||
      guide.phone.toLowerCase().includes(query)
    );
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const AddGuide = async (guide) => {
    try {
      await handleCreateGuide(guide);
      await handleFetchGuides();
      setIsAddModalOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        experiance: "",
        birth_date: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong");
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedGuide) return;
    try {
      await handleUpdateGuide(selectedGuide.guide_id, formData);
      await handleFetchGuides();
      setIsEditModalOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        experiance: "",
        birth_date: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <WhiteContainer>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-5">
            <SearchBar
              placeholder="Search for a guide"
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              searchQuery={searchQuery}
            />
            <div className="flex flex-row justify-between w-100">
              <ButtonOutline>
                Sort
                <ArrowUpDown size={18} className="ml-2" />
              </ButtonOutline>
              <ButtonOutline>
                Filter
                <SlidersHorizontal size={18} className="ml-2" />
              </ButtonOutline>
              <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                New Guide
                <Plus size={22} className="ml-2" />
              </ButtonFill>
            </div>
          </div>
        </div>

        <Table
          onSelect={(guide) => {
            setSelectedGuide(guide);
            setIsEntryModalOpen(true);
          }}
          onEdit={(guide) => {
            setSelectedGuide(guide);
            setFormData({
              first_name: guide.first_name,
              last_name: guide.last_name,
              phone: guide.phone,
              experiance: guide.experiance,
              birth_date: guide.birth_date,
            });
            setIsEditModalOpen(true);
          }}
          onDelete={(guide) => {
            setSelectedGuide(guide);
            setIsDeleteModalOpen(true);
          }}
          columns={[
            { title: "ID", format: (item) => item.guide_id },
            { title: "First Name", format: (item) => item.first_name },
            { title: "Last Name", format: (item) => item.last_name },
            { title: "Phone", format: (item) => item.phone },
            { title: "Birth Date", format: (item) => new Date(item.birth_date).toLocaleDateString() },
          ]}
          data={filteredGuides}
        />
      </WhiteContainer>

      <TableEntryModal
        title="Guide Information"
        open={isEntryModalOpen}
        properties={[
          { name: "ID", value: selectedGuide?.guide_id },
          { name: "First Name", value: selectedGuide?.first_name },
          { name: "Last Name", value: selectedGuide?.last_name },
          { name: "Phone", value: selectedGuide?.phone },
          { name: "Experiance", value: selectedGuide?.experiance },
          { name: "Birth Date", value: new Date(selectedGuide?.birth_date).toLocaleDateString() },
        ]}
      >
        <X
          size={25}
          className="absolute top-5 right-5 cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={() => setIsEntryModalOpen(false)}
        />
      </TableEntryModal>

      <ModalDialog title="New Guide" description="Add a new guide to the team" open={isAddModalOpen}>
        <div className="grid grid-cols-2 gap-4 mb-7">
          <InputField label="First Name" name="first_name" onChange={handleFormChange} />
          <InputField label="Last Name" name="last_name" onChange={handleFormChange} />
          <InputField label="Phone" name="phone" onChange={handleFormChange} />
          <InputField label="Experiance" name="experiance" onChange={handleFormChange} />
          <InputField
            label="Birth Date"
            type="date"
            name="birth_date"
            onChange={(e) => handleFormChange({ target: { name: "birth_date", value: new Date(e.target.value).toISOString() } })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ButtonFill onClick={() => AddGuide(formData)}>Add Guide</ButtonFill>
          <ButtonOutline onClick={() => setIsAddModalOpen(false)}>Cancel</ButtonOutline>
        </div>
      </ModalDialog>

      <ModalDialog title={`Edit Guide ${selectedGuide?.guide_id ?? ""}`} open={isEditModalOpen}>
        <div className="grid grid-cols-2 gap-4 mb-7">
          <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleFormChange} />
          <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleFormChange} />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} />
          <InputField label="Experiance" name="experiance" value={formData.experiance} onChange={handleFormChange} />
          <InputField
            label="Birth Date"
            type="date"
            name="birth_date"
            value={new Date(formData.birth_date).toISOString().split("T")[0]}
            onChange={(e) => handleFormChange({ target: { name: "birth_date", value: new Date(e.target.value).toISOString() } })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <ButtonFill onClick={handleEditSubmit}>Save Changes</ButtonFill>
          <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
        </div>
      </ModalDialog>

      <ModalDialog open={isDeleteModalOpen}>
        <div className="text-center text-xl">
          <h1>Are you sure you want to delete the guide with ID</h1>
          <span className="text-(--color-text-secondary)">{selectedGuide?.guide_id}</span>
          <h1>This action cannot be undone</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <ButtonFill
            onClick={async () => {
              if (!selectedGuide) return;
              try {
                await handleDeleteGuide(selectedGuide.guide_id);
                await handleFetchGuides();
                setIsDeleteModalOpen(false);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Yes
          </ButtonFill>
          <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
        </div>
      </ModalDialog>
    </>
  );
}
