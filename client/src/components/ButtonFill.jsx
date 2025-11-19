export default function ButtonFill({children, onClick}) {
    return (
        <button
            onClick={onClick}
            className={`
            bg-(--color-primary) hover:bg-(--color-hover) text-white
            flex flex-row justify-center items-center
            px-4 py-3
            w-50 rounded-3xl
            cursor-pointer 
            font-medium
            transition-colors duration-100 ease-in-out
`}>
            {children}
        </button>
    )
}