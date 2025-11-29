import {Edit, Trash2, ChevronLeft, ChevronRight} from "lucide-react";
import {useMemo, useState} from "react";

export default function Table({columns = [],  data = [], onSelect, onEdit, onDelete}) {
    /**
    Dynamic Table component:

    @param columns
    a list of key-value pairs, consisting of the `title` key, which is the name of the column, and the `format` key,
    which contains the HTML structure of each row in the corresponding column
    @param data
    the actual content of the table
    */

    const iconClass = "hover:text-gray-600 duration-100 cursor-pointer"

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 7
    const paginatedRows = useMemo(
        () =>
        {
            const start = currentPage * pageSize;
            return data.slice(start, start + pageSize);
        }
        , [data, currentPage, pageSize]
    );

    const totalPages = Math.ceil(data.length / pageSize) ?? 0;


    return (
        <>
            {/* Table Header */}
            <table className="border-1 border-gray-200 w-full">
                <thead className="bg-gray-100">
                <tr className={"h-10 relative text-left"}>
                    <th className="p-3 text-left">
                        <input type="checkbox"/>
                    </th>
                    {columns.map((column, index) => (
                        <th key={index}>
                            {column.title}
                        </th>
                    ))}
                    <th className="text-center">
                        Actions
                    </th>
                </tr>
                </thead>

                {/* Table Rows */}
                <tbody className={"text-center"}>

                {
                    data.length === 0 &&
                    <td colSpan={columns.length + 2} className={"text-xl py-4"}>
                        No Data Found
                    </td>
                }
                {
                    paginatedRows.map((item) => (
                        <tr
                            className={"h-17 border-1 border-gray-200 relative hover:bg-gray-100 duration-100 cursor-pointer"}
                            onClick={() => onSelect(item)}
                        >
                            {/* Row Checkbox */}
                            <td className="p-3 text-left">
                                <input type="checkbox"/>
                            </td>

                            {/* Dynamic Rendering of each column */}
                            {
                                columns.map((column, index) => (
                                    <td key={index}>
                                        {column.format ? column.format(item) : null}
                                    </td>
                                ))
                            }

                            {/* Actions */}
                            <td className={"text-gray-400 text-center"}>
                                <div className={"flex flex-row justify-around"}>
                                    {
                                        onEdit &&
                                        <Edit
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation() // prevent row select
                                                    onEdit(item) // pass the object so that it gets stored by the parent component
                                                }
                                            }
                                            className={iconClass}
                                        />
                                    }
                                    {
                                        onDelete &&
                                        <Trash2
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation() // prevent row select
                                                    onDelete(item) // pass the object so that it gets stored by the parent component
                                                }
                                            }
                                            className={`${iconClass} hover:text-red-700`}
                                        />
                                    }
                                </div>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

            {/* Pagination */}
            {
                data.length > 0 &&
                <div className="flex justify-center w-full items-center gap-3">
                    <button
                        className={`rounded-lg p-2 disabled:opacity-30 cursor-pointer duration-100 hover:text-(--color-primary)`}
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <ChevronLeft/>
                    </button>
                    {currentPage+1}/{totalPages}
                    <button
                        className={`rounded-lg p-2 disabled:opacity-30 cursor-pointer duration-100 hover:text-(--color-primary)`}
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <ChevronRight/>
                    </button>
                </div>
            }
        </>
    )
}