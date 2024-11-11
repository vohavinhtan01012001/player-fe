import React, { useState, useEffect } from 'react';
import './Banner.css'
import { BannerService } from '../../../../../services/bannerService';


const Banner: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [banners, setBanners] = useState<any[]>([]);

    const getBanners = async () => {
        try {
            const res = await BannerService.getBanners();
            const bannerList = res.data.data.filter((item: any) => item.status !== 0)
            setBanners(bannerList.map((item: any) => {
                return {
                    src: item.image,
                    alt: item.title
                }
            }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBanners()
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [banners.length]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    return (
        <div className={`banner-container ${banners.length === 0 ? "!hidden":""}`}>
            <div className="banner">
                <div className="banner-image duration-300">
                    <img src={banners[currentImageIndex]?.src} alt={banners[currentImageIndex]?.alt} />
                </div>
                <div className="banner-controls">
                    <button onClick={prevImage} className="banner-button">❮</button>
                    <button onClick={nextImage} className="banner-button">❯</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
