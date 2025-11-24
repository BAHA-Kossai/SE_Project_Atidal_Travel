import {ChevronRight} from "lucide-react";

export default function PagePath({pathItems}) {
    return (
        <div className={"flex flex-row justify-start items-center"}>
            {
                pathItems.map((pathItem, index) => (
                    <div className={"flex flex-row items-center"}>
                        <div key={index}
                             className={`${index < pathItems.length - 1 ? "text-gray-400" : "text-(--color-text-secondary)"}`}
                        >
                            {pathItem}
                        </div>
                        {index < pathItems.length - 1 && <ChevronRight size={22} className={"mx-2 text-gray-400"} />}
                    </div>
                ))
            }
        </div>
    )
}