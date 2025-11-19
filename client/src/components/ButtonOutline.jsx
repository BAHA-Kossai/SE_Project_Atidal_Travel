export default function ButtonOutline({children}) {
    return (
        <button className={`
            border-1 border-(--color-primary) text-(--color-primary)
            flex flex-row justify-center items-end
            px-4 py-3
            w-50 rounded-3xl
            cursor-pointer hover:bg-blue-50
            font-medium
            transition-colors duration-100 ease-in-out
`}>
            {children}
        </button>
    )
}