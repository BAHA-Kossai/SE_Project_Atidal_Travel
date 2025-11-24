export default function InputField(props) {

    return (
        <main className={`flex flex-col text-gray-700 ${props.className}`} style={props.style}>
            <label className={"mb-2"}>{props.label}</label>

            {
                props.type === "select" ?
                    <select name="select" className={`flex flex-col text-gray-700 ${props.className}`} style={props.style}>
                        {
                            props.options.map((option, index) => (
                                <option
                                    key={index}
                                    value={option["value"]}
                                >
                                    {option["name"]}
                                </option>
                            ))
                        }
                    </select >
                    :
                    <input
                        type={props.type}
                        disabled={props.disabled}
                        value={props.value}
                        className={`border-1 py-3 px-3 border-gray-500 rounded-lg w-${props.width} max-w-${props.fieldMaxWidth}`}
                        onChange={props.onChange}
                    />
            }
            {
                props.error &&
                <h1 className={"text-red-600"}>
                    {props.error}
                </h1>
            }
        </main>
    )
}
