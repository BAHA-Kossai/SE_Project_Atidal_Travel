export default function Tabs({items = [], activeTab, setActiveTab}) {
    return (
        <>
            {/* Iterate through tabs to render them */}
            <div className="tabs">
                {items.map((tab, index) => (
                    <button key={index}
                            onClick={() => setActiveTab(tab)}
                            className={`tab ${activeTab  === tab ? 'tab-active' : ''}`}
                    >{tab}
                    </button>
                ))}
            </div>
        </>
    )
}