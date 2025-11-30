import ModalDialog from "./ModalDialog.jsx";

export default function TableEntryModal({title, open, properties = [], children}) {
    return (
        <ModalDialog
            open={open}
            title={title}
        >
            <div className={"grid grid-cols-2 gap-4"}>
            {
                properties.length > 0 &&
                properties.map((entry) => (
                        <div className="flex justify-between
                        w-full
                        border-2 border-gray-400 rounded-md
                        my-2 p-2">
                            <h1 className="text-(--color-primary) font-semibold">
                                {entry.name}
                            </h1>
                            <h1>
                                {entry.value}
                            </h1>
                        </div>
                ))
            }
            </div>
            {children}
        </ModalDialog>
    )
}