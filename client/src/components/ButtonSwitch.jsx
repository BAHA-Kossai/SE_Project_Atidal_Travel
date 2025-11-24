export default function ButtonSwitch({onClick, className, style, width = 15, children, isSelected}) {
    return (
        <button
            onClick={onClick}
            className={`
            border-1 
            flex flex-row justify-center items-center
            px-4 py-3
            w-${width} rounded-3xl
            cursor-pointer hover:bg-blue-50
            ${
                isSelected ? 
                    'bg-blue-50 border-(--color-primary) text-(--color-primary)' 
                    : 
                    'bg-transparent border-gray-400 text-gray-400'}
            font-medium
            transition-colors duration-100 ease-in-out
            ${className}
`}
            style={style}
        >
            {children}
        </button>
    )
}