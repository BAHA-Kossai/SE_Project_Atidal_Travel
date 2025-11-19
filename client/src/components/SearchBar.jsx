import {useState} from "react";
import { X, Search } from 'lucide-react'
import '../styles/appbar.css'

export default function SearchBar({placeholder = "Search"}) {
    const [searchBar, setSearchBar] = useState('');
    return (
        <div className="appbar-search-wrapper">
            <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="search-input"
                    value={searchBar}
                    onChange={(e) => setSearchBar(e.target.value)}
                />
                <button className="search-clear-btn" onClick={() => setSearchBar('')}>
                    <X className="w-5 h-5"/>
                </button>
            </div>
        </div>
    )
}