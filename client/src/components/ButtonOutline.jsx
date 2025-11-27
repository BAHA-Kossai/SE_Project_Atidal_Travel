export default function ButtonOutline({children, width = 15, onClick, className, style}) {
    return (
        <button
            onClick={onClick}
            className={`
            border-1 border-(--color-primary) text-(--color-primary)
            flex flex-row justify-center items-center
            px-4 py-3
            w-${width} rounded-3xl
            cursor-pointer hover:bg-blue-50
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