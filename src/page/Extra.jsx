import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import logo from '../assets/img 1.png';


import logo1 from '../assets/img 2.png';
import logo2 from '../assets/img 3.png';
import logo3 from '../assets/img 4.png';
import logo4 from '../assets/img 5.png';

const products = [
  {
    id: 1,
    name: "Classic White",
    price: "$79",
    image: logo,
  },
  {
    id: 2,
    name: "Premium Black",
    price: "$89",
    image: logo1,
  },
  {
    id: 3,
    name: "Royal Navy",
    price: "$95",
    image: logo2,
  },
  {
    id: 4,
    name: "Luxury Beige",
    price: "$99",
    image: logo3,
  },
  {
    id: 5,
    name: "Luxury Beige",
    price: "$99",
    image: logo4,
  },
];

export default function Extra() {
  return (
    <section className="bg-[#0B0B0B] py-15 px-4">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        slidesPerView={1.2}
        loop={true}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
          },
          768: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            {({ isActive }) => (
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.55,
                }}
                whileHover={{
                  y: -10,
                }}
                transition={{ duration: 0.4 }}
                className="bg-[#111111] rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl"
              >
               <div className="overflow-hidden">
  <motion.img
    whileHover={{ scale: 1.08 }}
    transition={{ duration: 0.4 }}
    src={item.image}
    alt={item.name}
    className="w-full object-cover"
    style={{ height: "650px" }}
  />
</div>

                <div className="p-6">
                  <p className="text-[#D4AF37] uppercase text-xs tracking-[4px]">
                    Premium Collection
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-2">
                    {item.name}
                  </h2>

                  <p className="text-gray-400 mt-3">
                    Premium Wash & Wear Fabric crafted for luxury,
                    comfort and elegance.
                  </p>

                  <div className="flex items-center justify-between mt-6">
                    <h3 className="text-3xl text-[#D4AF37] font-bold">
                      {item.price}
                    </h3>

                    <button className="px-6 py-3 rounded-full bg-[#D4AF37] text-black font-semibold hover:bg-white transition">
                      Shop Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}