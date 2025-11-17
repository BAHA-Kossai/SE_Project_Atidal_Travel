import WhiteContainer from "../../WhiteContainer.jsx";
import Switch from "../../Switch.jsx";

export default function TabNotifications() {
    const options = [
        { title: "Order notifications", description: "Receive notifications about new orders" },
        { title: "Alerts", description: "Receive notifications about alerts" },
        { title: "Order notifications", description: "Receive notifications without sound" }
    ]

    return (
        <WhiteContainer title={"Notification settings"}>
            {
                options.map((item) => (
                    <NotificationOption title={item.title} description={item.description} />
                ))
            }
        </WhiteContainer>
    )
}

const NotificationOption = ({title, description}) => {
    return (
        <div className={"flex flex-row justify-between items-center mb-5"}>
            <div>
                <h1 className={"text-[18px]"}>{title}</h1>
                <h1 className={"text-[15px] text-gray-400"}>{description}</h1>
            </div>
            <Switch />
        </div>
    )
}