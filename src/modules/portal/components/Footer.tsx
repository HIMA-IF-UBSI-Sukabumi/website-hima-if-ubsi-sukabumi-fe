import {HiOutlineEnvelope} from "react-icons/hi2";
import {FaInstagram} from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="w-full bg-primary">
            <div
                className="max-w-7xl mx-auto px-4 py-14 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-4"
            >
                <div className="flex flex-col text-white items-center md:items-start">
                    <div className="h-40 flex items-center">
                        <img
                            src="/assets/logo-himaif.webp"
                            alt="HIMA-IF"
                            className="w-40 h-40 pointer-events-none"
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-sm opacity-90 items-center md:items-start">
                        <div className="flex items-center gap-2">
                            <FaInstagram className="w-6 h-6"/>
                            <span>@himaif.ubsi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiOutlineEnvelope className="w-6 h-6"/>
                            <span>himaif.smi@bsi.ac.id</span>
                        </div>
                    </div>
                </div>

                <div
                    className="h-40 flex items-center text-white text-center md:text-left"
                >
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-extrablack tracking-wide">
                            HIMA–IF
                        </h2>
                        <p className="mt-2 text-sm opacity-90">
                            UBSI PSDKU Sukabumi
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
