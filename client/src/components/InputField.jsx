export default function InputField({label, value}) {
    return (
        <main className="flex flex-col text-gray-700">
            <label className={"mb-2 font-semibold"}>{label}</label>
            <input type="text" disabled={true} value={value} className={"border-1 py-2 px-3 border-gray-500 rounded-lg"}/>
        </main>
    )
}
