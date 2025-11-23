import WhiteContainer from "../WhiteContainer.jsx";
import Switch from "../Switch.jsx";
import Setting from "./Setting.jsx";

export default function TabNotifications() {
    const options = [
        { title: "Order notifications", description: "Receive notifications about new orders" },
        { title: "Alerts", description: "Receive notifications about alerts" },
        { title: "Order notifications", description: "Receive notifications without sound" }
    ]

    return (
        <main className={"mt-5"}>
            <WhiteContainer title={"Notification settings"}>
                {
                    options.map((item) => (
                        <Setting
                            title={item.title}
                            description={item.description}
                            button={<Switch/>}
                        />
                    ))
                }
            </WhiteContainer>
        </main>
    )
}