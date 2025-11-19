import {Copy, Edit, Trash2, ChevronLeft, ChevronRight} from "lucide-react";
import {useMemo, useState} from "react";

export default function Table({columns = [], data = [] }) {
    const iconClass = "hover:text-gray-600 duration-100 cursor-pointer"
    // const checkboxClass = "absolute left-5 w-4 h-4"

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7

    const paginatedRows = useMemo(() => {
        const start = currentPage * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize]);

    const totalPages = Math.ceil(data.length / pageSize);


    return (
        <>
            {/* Table Header */}
            <table className="border-1 border-gray-200">
                <thead className="bg-gray-100">
                <tr className={"h-10 relative text-left"}>
                    <th className="p-3 text-left">
                        <input type="checkbox"/>
                    </th>
                    {columns.map((column, index) => (
                        <th key={index}>
                            {column}
                        </th>
                    ))}
                </tr>
                </thead>

                {/* Table Rows */}
                <tbody className={"text-center"}>
                {paginatedRows.map((item) => (
                    <tr className={"h-17 border-1 border-gray-200 relative"}>
                        <td className="p-3 text-left">
                            <input type="checkbox"/>
                        </td>
                        {/* Destination Country + City */}
                        <td className={"text-gray-400 text-center"}>
                            <div className="flex items-center gap-3">

                                {/* Avatar / Image placeholder */}
                                <div className="w-10 h-10 bg-gray-100 rounded">
                                    <img src={item["imageURL"]} width={40} alt="img"/>
                                </div>

                                <div className={"flex flex-col items-start gap-3"}>
                                    <div className="text-gray-700 font-medium">{item["Destination"].country}</div>
                                    <div className="text-(--color-text-secondary) text-sm cursor-pointer">{item["Destination"].city}</div>
                                </div>

                            </div>
                        </td>

                        {/* Created By */}
                        <td className={"text-gray-400 text-left"}>{item["Created By"]}</td>

                        {/* Created At */}
                        <td className={"text-gray-400 text-left"}>{item["Created At"]["date"]} at {item["Created At"]["time"]}</td>

                        {/* Actions */}
                        <td className={"text-gray-400 text-left"}>
                            <div className={"flex flex-row justify-around"}>
                                <Copy className={iconClass}/>
                                <Edit className={iconClass}/>
                                <Trash2 className={`${iconClass} hover:text-red-700`}/>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center w-full items-center gap-3">
                <button
                    className={`rounded-lg p-2 disabled:opacity-30 cursor-pointer`}
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    <ChevronLeft/>
                </button>
                {currentPage+1}/{totalPages}
                <button
                    className={`rounded-lg p-2 disabled:opacity-30 cursor-pointer`}
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    <ChevronRight/>
                </button>
            </div>
        </>
    )
}