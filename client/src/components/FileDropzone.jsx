import {FileIcon, UploadCloud, UploadIcon} from "lucide-react";
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

    // Determine preview and file type
    let previewSrc = null;
    let fileName = null;
    let isImage = false;


    // Case 1: Local upload (file object)
    if (props.selectedFile && props.selectedFile.file instanceof File) {
        const file = props.selectedFile.file;
        fileName = file.name;
        isImage = file.type.startsWith("image/");
        previewSrc = props.selectedFile.preview;
    }

    // Case 2: Direct string (URL or base64)
    else if (typeof props.selectedFile === "string") {
        previewSrc = props.selectedFile;

        // Detect if URL looks like an image
        const url = props.selectedFile.toLowerCase()
        isImage =
            url.endsWith(".jpg") ||
            url.endsWith(".jpeg") ||
            url.endsWith(".png") ||
            url.endsWith(".gif") ||
            url.endsWith(".webp") ||
            url.endsWith("data:image")


        // Extract file name for non-image
        if (!isImage) {
            try {
                fileName = props.selectedFile.split("/").pop()
            }
            catch {
                fileName = "file"
            }
        }
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

            {/* Placeholder when no file is selected */}
            {!props.selectedFile && (
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

            {/* When an Image is selected */}
            {props.selectedFile && isImage && (
                <img className={`
                                w-full
                                rounded-3xl
                                `}
                     style={{
                         // set height for the placeholder when no file is selected
                         height: props.selectedFile ? "auto" : props.height
                     }}
                     src={previewSrc}
                     alt={"Preview Image"}
                />
            )
            }

            {/* When the file is not an image */}
            {props.selectedFile && !isImage && (
                <div className={"flex flex-col items-center gap-3 py-6 text-gray-700"}>
                    <FileIcon size={60}/>
                    <span className="text-sm font-medium">
                        {fileName}
                    </span>
                </div>
            )
            }
        </label>
    )
}