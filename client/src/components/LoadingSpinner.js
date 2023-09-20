import { ColorRing } from "react-loader-spinner";

const LoadingSpinner = () => {
    return (
        <div className="text-center mt-5 mb-5">
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#198754", "#198754", "#198754", "#198754", "#198754"]}
            />
        </div>
    );
}

export default LoadingSpinner;