export default function InputField({className, style, label, value, type = "text", fieldMaxWidth = null, width = null, disabled = false}) {
    return (
        <main className={`flex flex-col text-gray-700 ${className}`} style={style}>
            <label className={"mb-2 font-semibold"}>{label}</label>
            <input
                type={type}
                disabled={disabled}
                value={value}
                className={`border-1 py-3 px-3 border-gray-500 rounded-lg w-${width} max-w-${fieldMaxWidth}`}
            />
        </main>
    )
}
