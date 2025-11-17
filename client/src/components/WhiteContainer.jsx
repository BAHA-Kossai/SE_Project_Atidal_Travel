export default function WhiteContainer({title, children}) {
    return (

        <main className="relative bg-white font-normal mt-5 bg-whie border-2 border-gray-200 p-5 rounded-3xl">
            <div className={"text-[20px] mb-4"}>{title}</div>
            {children}
        </main>
    )
}
