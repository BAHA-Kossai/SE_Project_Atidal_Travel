import InputField from "../InputField.jsx";

export default function TabGuides() {
    return (
        <>
            <InputField className={"col-span-2"} error={errors["date_of_birth"]} label={"Experience"} type="text area" onChange={handleFormChange}/>
        </>
    )
}
