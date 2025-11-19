import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import PagePath from "../components/PagePath.jsx";

export default function AdminAddDestination() {

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Add a destination
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Destinations", "Add a destination"]}/>
            </div>

            <WhiteContainer title={"Add a destination"}>
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}
