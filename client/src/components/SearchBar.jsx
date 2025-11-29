import { X, Search } from 'lucide-react'
import '../styles/app_bar_side_bar_with_content.css'

export default function SearchBar({placeholder = "Search", onChange, onClear, searchQuery}) {
    return (
        <div className="appbar-search-wrapper">
            <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    className="search-input"
                    onChange={onChange}
                />
                {
                    searchQuery.length > 0 &&
                    <button
                        className="search-clear-btn"
                        onClick={onClear}>
                        <X className="w-5 h-5"/>
                    </button>
                }
            </div>
        </div>
    )
}