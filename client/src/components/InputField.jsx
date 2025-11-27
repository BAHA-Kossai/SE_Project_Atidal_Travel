export default function InputField(props) {

    return (
        <main className={`flex flex-col text-gray-700 ${props.className}`} style={props.style}>
            <label className={"mb-2"}>{props.label}</label>

            {
                props.type === "select" ?
                    <select
                        name="select"
                        value={props.value}
                        onChange={props.onChange}
                        className={`border-1 py-3 px-3 border-gray-500 rounded-lg w-${props.width} max-w-${props.fieldMaxWidth}`}
                        style={props.style}>
                        {
                            props.options.map((option, index) => (
                                <option
                                    key={index}
                                    value={option.toString()}
                                >
                                    {option}
                                </option>
                            ))
                        }
                    </select >
                    :
                    <input
                        type={props.type}
                        disabled={props.disabled}
                        name={props.name}
                        value={props.value}
                        className={`border-1 py-3 px-3 border-gray-500 rounded-lg w-${props.width} max-w-${props.fieldMaxWidth}`}
                        onChange={props.onChange}
                    />
            }
            {
                props.error &&
                <p className="text-red-500 text-xs mt-1">{props.error}</p>
            }
        </main>
    )
}
