" use client ";
import { motion } from "framer-motion";
import { Company } from "./CompanyTypes";

export const AboutCompany = ({ company }: { company: Company }) => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <motion.img
              src={
                company.companyImages && company.companyImages.length > 1
                  ? company.companyImages[1]
                  : company.companyImages?.[0] ||
                    "https://res.cloudinary.com/dxhmgs7wt/image/upload/v1749803046/heroback_wzxjtk.jpg"
              }
              alt="Company Image"
              className="rounded-2xl shadow-2xl w-full h-auto"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl -z-10"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-rose-600 font-medium tracking-wider uppercase mb-4">
                Бидний тухай
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {company.companyName}
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>{company.description}</p>
              <p> Манай хаяг: {company.address}</p>
              <p>📞 Холбоо барих: {company.phoneNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center p-4 bg-white/70 rounded-2xl shadow">
                <div className="text-2xl font-bold text-rose-600 mb-2">10+</div>
                <div className="text-gray-600">жилийн туршлага</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl shadow">
                <div className="text-2xl font-bold text-rose-600 mb-2">
                  Celebrity
                </div>
                <div className="text-gray-600">Approved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
