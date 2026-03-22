'use client';

import React from 'react';
import Link from 'next/link';
import { FaCreditCard, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import '../../styles/PromoBanners.css';

const PromoBanners = () => {
    return (
        <section className="promo-banners-section mb-12 px-4" style={{ paddingTop: '10px' }}>
            <div className="w-full bg-[#e2e6eb] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#d1d5db]" style={{ maxWidth: '1480px', margin: '0 auto', paddingTop: '48px', paddingBottom: '48px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
                    <div className="mb-6 flex justify-start items-center">
                        <h2 className="text-3xl md:text-[2.5rem] font-bold text-black m-0 leading-[1.2]">
                            Ofertas <b className="text-[#0066cc]">semanales</b>
                        </h2>
                    </div>
                </div>
                <div className="promo-banners-container" style={{ padding: '0 16px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Banner 1: JBL */}
                <Link href="/product/378" className="tb-card tb-jbl">
                    <div className="tb-image-col">
                        {/* Background handles the image */}
                    </div>
                    <div className="tb-text-col tb-text-light">
                        <h2 className="tb-title -mb-1">JBL CHARGE 6</h2>
                        <div className="text-3xl md:text-4xl font-black text-white">$309.999</div>
                        <div className="text-[11px] font-bold text-slate-300 md:mb-5">
                            * 10% de descuento abonando por transferencia
                        </div>
                        <div className="tb-features">
                            <div className="tb-feature">
                                <div className="tb-icon-wrapper"><FaCreditCard /></div>
                                <div className="tb-feature-text">
                                    <strong>HASTA 6 CUOTAS</strong>
                                    <span>SIN INTERÉS</span>
                                </div>
                            </div>

                            <div className="tb-feature">
                                <div className="tb-icon-wrapper"><FaTruck /></div>
                                <div className="tb-feature-text">
                                    <strong>ENVÍOS A</strong>
                                    <span>TODO EL PAÍS</span>
                                </div>
                            </div>
                        </div>
                        <div className="tb-btn">COMPRAR</div>
                    </div>
                </Link>

                {/* Banner 2: Xiaomi */}
                <Link href="/product/1339" className="tb-card tb-xiaomi">
                    <div className="tb-text-col tb-text-left tb-text-dark">
                        <h2 className="tb-title">XIAOMI SMART</h2>
                        <div className="tb-subtitle">
                            <strong>ROBOT S40C</strong> <span></span>
                        </div>
                        <div className="tb-features-row">
                            <div className="tb-feature-horizontal">
                                <div className="tb-icon-circle"><FaCreditCard /></div>
                                <div className="tb-feature-text">
                                    <strong>HASTA 6 CUOTAS</strong>
                                    <span>SIN INTERÉS</span>
                                </div>
                            </div>
                            <div className="tb-divider"></div>
                            <div className="tb-feature-horizontal">
                                <div className="tb-icon-circle"><FaTruck /></div>
                                <div className="tb-feature-text">
                                    <strong>ENVÍOS GRATIS</strong>
                                    <span>TODO EL PAÍS</span>
                                </div>
                            </div>
                        </div>
                        <div className="tb-btn tb-btn-green">COMPRAR</div>
                    </div>
                    <div className="tb-image-col">
                        {/* Background handles the image */}
                    </div>
                </Link>
            </div>
            </div>
        </section>
    );
};

export default PromoBanners;
