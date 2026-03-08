import CounsellorListing from "./counsellorListing";
import CounsellorListingCards from "./counsellorListingCards";

const ABPage = () => {
    return (
        <>
            <div className="flex">
                <CounsellorListing />
                <CounsellorListingCards />
            </div>
        </>
    );
};

export default ABPage;