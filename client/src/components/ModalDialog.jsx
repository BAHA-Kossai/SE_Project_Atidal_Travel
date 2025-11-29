import {createPortal} from "react-dom";

export default function ModalDialog({title, description, children, open}) {

    if (!open) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50`}>
                {/* Modal */}
                <div
                    className={`bg-white rounded-xl shadow-xl px-10 py-8 max-h-195 max-w-3xl w-full overflow-y-scroll relative`}>

                    {/* Title and Description */}
                    <div className={"mb-5"}>
                        <h1 className={"text-2xl"}>{title}</h1>
                        {
                            description
                            &&
                            <h1 className={"text-md text-gray-400 mt-3"}>{description}</h1>
                        }
                    </div>

                    {children}
                </div>
            </div>
        </>,
        document.getElementById("portal")
    )
}