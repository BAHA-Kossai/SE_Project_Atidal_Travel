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

//----for api req
import { useAdminHandlers } from "../../../hooks/useAdminHandlers.js";
import Swal from "sweetalert2";

export default function TabAdmins() {
  const {
    admins,
    handleFetchAdmins,
    handleCreateAdmin,
    handleDeleteAdmin,
    handleUpdateAdmin,
    message,
  } = useAdminHandlers();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleFetchAdmins().catch((err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch admins'
      });
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdmins = admins.filter((admin) => {
    return (
      admin.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleEditSubmit = async () => {
    try {
      if (!selectedAdmin) return;
      setLoading(true);

      // Call the update handler
      await handleUpdateAdmin(selectedAdmin.user_id, formData);

      // Refresh the admins table
      await handleFetchAdmins();

      // Close the edit modal
      setIsEditModalOpen(false);

      // Reset form
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admin updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Failed to update admin:", err);
      setErrorMessage(err.message || "Something went wrong");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to update admin'
      });
    } finally {
      setLoading(false);
    }
  };

  // New/Edit/Delete/Select Employee Modals
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Employee Form Credentials
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    // type: "ADMIN",
  });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [isSubmit, setIsSubmit] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const AddEmployee = async (employee) => {
    try {
      setLoading(true);
      await handleCreateAdmin(employee); // call the API

      // Add it to state
      await handleFetchAdmins();
      // Reset modal and form
      setIsAddModalOpen(false);
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admin created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Failed to add admin:", err.message);
      setErrorMessage(err.message || "Something went wrong");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to create admin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors(validateSubmission());
    setIsSubmit(true);

    if (Object.keys(errors).length === 0 && isSubmit) {
      // Add employee entry and close modal
      AddEmployee();
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <WhiteContainer>
        <div className="flex flex-col">
          {/* Search / Sort / Filter/ New Admin */}
          <div className="flex flex-row justify-between items-center mb-5">
            <SearchBar
              placeholder={"Search for an admin"}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              searchQuery={searchQuery}
            />
            <div className="flex flex-row justify-between w-100">
              <ButtonOutline>
                Sort
                <ArrowUpDown size={18} className={"ml-2"} />
              </ButtonOutline>
              <ButtonOutline>
                Filter
                <SlidersHorizontal size={18} className={"ml-2"} />
              </ButtonOutline>
              <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                New Admin
                <Plus size={22} className={"ml-2"} />
              </ButtonFill>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <Table
          onSelect={(
            admin // employee gets sent by the Table component
          ) => {
            setSelectedAdmin(admin);
            setIsEntryModalOpen(true);
          }}
          // In the Table onEdit handler
          onEdit={(admin) => {
            setSelectedAdmin(admin);
            setFormData({
              email: admin.email,
              first_name: admin.first_name,
              last_name: admin.last_name,
              phone: admin.phone,
              date_of_birth: admin.date_of_birth,
              password: "", // leave empty by default
            });
            setIsEditModalOpen(true);
          }}
          onDelete={(
            admin // employee gets sent by the Table component
          ) => {
            setSelectedAdmin(admin);
            setIsDeleteModalOpen(true);
          }}
          columns={[
            { title: "ID", format: (item) => item.user_id },
            { title: "First Name", format: (item) => item.first_name },
            { title: "Last Name", format: (item) => item.last_name },
            { title: "Email", format: (item) => item.email },
            { title: "Phone", format: (item) => item.phone },
            { title: "Date of Birth", format: (item) => item.date_of_birth },
          ]}
          data={filteredAdmins}
        />
      </WhiteContainer>

      <TableEntryModal
        title={"Admin Information"}
        open={isEntryModalOpen}
        properties={[
          { name: "ID", value: selectedAdmin?.user_id },
          { name: "First Name", value: selectedAdmin?.first_name },
          { name: "Last Name", value: selectedAdmin?.last_name },
          { name: "Email", value: selectedAdmin?.email },
          { name: "Phone", value: selectedAdmin?.phone },
          { name: "Date of Birth", value: selectedAdmin?.date_of_birth },
          // { name: "Type", value: selectedAdmin?.type },
        ]}
      >
        <X
          size={25}
          className={`
                absolute top-5 right-5
                cursor-pointer 
                text-gray-400 hover:text-gray-600
                `}
          onClick={() => setIsEntryModalOpen(false)}
        />
      </TableEntryModal>

      {/* New Admin Modal */}
      <ModalDialog
        title={"New Admin"}
        description={"Add a new admin to the team"}
        open={isAddModalOpen}
      >
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h1 className={"text-xl"}>Personal Information</h1>
          {errorMessage && (
            <div className="text-red-600 mb-4 text-sm">{errorMessage}</div>
          )}
          <div className={"grid grid-cols-2 gap-4 mb-7"}>
            <InputField
              label="First Name"
              name="first_name"
              onChange={handleFormChange}
            />
            <InputField
              label="Last Name"
              name="last_name"
              onChange={handleFormChange}
            />
            <InputField
              label="Email"
              name="email"
              onChange={handleFormChange}
            />
            <InputField
              label="Phone"
              name="phone"
              onChange={handleFormChange}
            />
            <InputField
              label="Date of Birth"
              type="date"
              name="date_of_birth"
              onChange={handleFormChange}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              onChange={handleFormChange}
            />
          </div>

          {/* Employment Details */}
          {/* <h1 className={"text-xl"}>
                        Employment Details
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField error={errors.hire_date} label={"Hire date"} type="date" onChange={handleFormChange}/>
                        <InputField error={errors.branch_name} label={"Branch name"} type="text" onChange={handleFormChange}/>
                    </div> */}

          {/* Add/Cancel Buttons */}
          <div className={"grid grid-cols-2 gap-4"}>
            <ButtonFill width="full" onClick={() => AddEmployee(formData)} disabled={loading}>
              {loading ? 'Adding...' : 'Add Admin'}
            </ButtonFill>
            <ButtonOutline
              width="full"
              onClick={() => setIsAddModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </ButtonOutline>
          </div>
        </form>
      </ModalDialog>

      {/* Edit Employee Modal */}
      <ModalDialog
        title={`Edit Employee ${selectedAdmin?.user_id ?? ""}`}
        open={isEditModalOpen}
      >
        <div className={"grid grid-cols-2 gap-4"}>
          <InputField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
          <InputField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
          />
          <InputField
            label="Date of Birth"
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleFormChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            placeholder="Leave empty to keep current"
          />
        </div>

        <div className={"grid grid-cols-2 gap-4 mt-6"}>
          <ButtonFill width="full" onClick={handleEditSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </ButtonFill>
          <ButtonOutline width="full" onClick={() => setIsEditModalOpen(false)} disabled={loading}>
            Cancel
          </ButtonOutline>
        </div>
      </ModalDialog>

      {/* Delete Employee Modal */}
      <ModalDialog open={isDeleteModalOpen}>
        <div className={"text-center text-xl"}>
          <h1>Are you sure that you want to delete the employee with ID</h1>
          <span className={"text-(--color-text-secondary)"}>
            {selectedAdmin?.user_id}
          </span>
          <h1>This action cannot be undone</h1>
        </div>
        <div className={"grid grid-cols-2 gap-4 mt-8"}>
          <ButtonFill
            onClick={async () => {
              try {
                setLoading(true);
                await handleDeleteAdmin(selectedAdmin.user_id);
                await handleFetchAdmins();
                setIsDeleteModalOpen(false);
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Admin deleted successfully',
                  timer: 2000,
                  showConfirmButton: false
                });
              } catch (err) {
                console.error(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: err.message || 'Failed to delete admin'
                });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes'}
          </ButtonFill>
          <ButtonOutline onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>
            No
          </ButtonOutline>
        </div>
      </ModalDialog>
    </>
  );
}
