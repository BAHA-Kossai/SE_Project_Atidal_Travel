export default function Setting({title, description, button}) {
    return (
        <>
            <div className={"flex flex-row justify-between items-center mb-4"}>
                <div className="ml-3">
                    <div className={"text-[20px] font-normal"}>{title}</div>
                    <div className={"text-[15px] text-gray-500"}>{description}</div>
                </div>

                {button}
            </div>
        </>
    )
}