import { useState, useEffect, useRef } from 'react';
import { debug } from '../../utils';
import "./ScrollPopup.css"

const SCROLL_THRESHOLD = 300; // px

export const ScrollPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const xD = useRef<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!xD.current) {
                setShowPopup(window.scrollY > SCROLL_THRESHOLD);
                debug(["SCROLL", window.scrollY])
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        debug("Showing!")
    }, [showPopup])

    return showPopup
        ? <div className="popup">
            <button onClick={() => {
                setShowPopup(false)
                xD.current = true
            }}>x</button>
            <h4>Don't Forget!</h4>
            <p>You get 10% the best prices in town when you purchase 20 cigars!</p>
        </div>
        : undefined;
};