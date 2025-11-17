export default function InputField({label, value, type = "text", fieldMaxWidth = null}) {
    return (
        <main className={`flex flex-col text-gray-700`}>
            <label className={"mb-2 font-semibold"}>{label}</label>
            <input
                type={type}
                disabled={true}
                value={value}
                className={`border-1 py-3 px-3 border-gray-500 rounded-lg max-w-${fieldMaxWidth}`}
            />
        </main>
    )
}
