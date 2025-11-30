import {UploadCloud, UploadIcon} from "lucide-react";
import {useState} from "react";

export default function FileDropzone(props) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                props.setSelectedFile(file);
            }
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        // Only update the state if a real file (image) is selected
        if (!file) return
        const preview = URL.createObjectURL(file);
        props.setSelectedFile({file, preview});
    }

    // Handle when the uploaded image is local or an online URL
    let previewSrc = null;
    if (typeof props.selectedFile === "string") {
        previewSrc = props.selectedFile;
    }
    else if (props.selectedFile && props.selectedFile.preview) {
        previewSrc = props.selectedFile.preview;
    }

    return (
        <label
            className={`
            cursor-pointer 
            flex flex-col items-center 
            rounded-3xl
            border-4 bg-[#f4f8fb] border-dashed border-[#669bbc]
            ${props.selectedFile ? "" : "py-2"}
            relative min-h-20`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                hidden
                type="file"
                accept={props.accept}
                name="image-upload"
                onChange={handleFileChange}
            />

            {/* Show placeholder if no file is uploaded, else show the image */}
            {
                previewSrc ? (
                        <img className={`
                                w-full
                                rounded-3xl
                                `}
                             style={{
                                 height: props.selectedFile ? "auto" : props.height
                             }}
                             src={previewSrc}
                             alt={"Preview Image"}
                        />
                    ) : (
                    // Placeholder
                    <div className={`flex flex-col items-center h-full gap-4 min-h-20`}>
                        <UploadCloud size={140} className={"text-(--color-primary)"}
                                     style={{
                                         color: "#669bbc",
                                     }}/>
                        <div className={"flex flex-row items-center"}>
                            <UploadIcon className={"mr-2"}
                                        style={{
                                            color: "#669bbc",
                                        }}
                            />
                            {props.placeholderText}
                        </div>
                    </div>
                )
            }
        </label>
    )
}